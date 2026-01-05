const db = require('../config/db.js');
const query = (sql, params = []) =>
    new Promise((resolve, reject) => {
        db.query(sql, params, (err, res) => err ? reject(err) : resolve(res));
    });

module.exports = {
    totalCustomers: () => new Promise((resolve, reject) => {
        db.query('SELECT COUNT(*) AS total FROM customer_user', (err, res) => err ? reject(err): resolve(res[0]));
    }),
    collectibles: () => new Promise((resolve, reject) => {
        const q = `
            SELECT SUM(c.amount - IFNULL(p.total_payments, 0)) AS collectibles
            FROM customer_user c
            LEFT JOIN (
                SELECT customer_id, SUM(payment) AS total_payments
                FROM payments
                GROUP BY customer_id
            ) p ON c.customer_id = p.customer_id
        `;

        db.query(q, (err, res) => {
            if (err) {
                console.error('❌ Collectibles query error:', err);
                return reject(err);
            }
            resolve(res[0]);
        });
    }),
    totalPayments: () => new Promise((resolve, reject) => {
        const q = `SELECT COUNT(*) AS total_payments FROM payments`;
        db.query(q, (err, res) => err ? reject(err) : resolve(res[0]));
    }),
    collectionRate: () => new Promise((resolve, reject) => {
        const q = `
            SELECT 
                IFNULL((SUM(p.payment) / SUM(c.amount)) * 100, 0) AS collection_rate
            FROM customer_user c
            LEFT JOIN payments p ON c.customer_id = p.customer_id
        `;
        db.query(q, (err, res) => err ? reject(err) : resolve(res[0]));
    }),
    activeRidersToday: () => new Promise((resolve, reject) => {
        const q = `
            SELECT COUNT(DISTINCT r.rider_id) AS active_riders
            FROM rider_user r
            JOIN customer_user c ON c.area = r.area AND c.lending_company = r.lending_company
            JOIN payments p ON p.customer_id = c.customer_id
            WHERE DATE(p.payment_date) = CURDATE()
        `;
        db.query(q, (err, res) => err ? reject(err) : resolve(res[0]));
    }),
    hourlyCollectionTrend: () => new Promise((resolve, reject) => {
        const q = `
            SELECT 
                HOUR(payment_date) AS hour,
                SUM(payment) AS total
            FROM payments
            WHERE DATE(payment_date) = CURDATE()
            GROUP BY HOUR(payment_date)
            ORDER BY hour
        `;
        db.query(q, (err, res) => err ? reject(err) : resolve(res));
    }),
    areaDailyPerformance: () => new Promise((resolve, reject) => {
        const q = `
            SELECT 
                c.area,
                SUM(c.daily_pay) AS target,
                IFNULL(SUM(p.payment), 0) AS collected,
                (IFNULL(SUM(p.payment), 0) / SUM(c.daily_pay)) * 100 AS achievement_rate
            FROM customer_user c
            LEFT JOIN payments p 
                ON p.customer_id = c.customer_id 
                AND DATE(p.payment_date) = CURDATE()
            GROUP BY c.area
            ORDER BY achievement_rate DESC
        `;
        db.query(q, (err, res) => err ? reject(err) : resolve(res));
    }),
    topPerformingRidersToday: () => new Promise((resolve, reject) => {
        const q = `
            SELECT 
                r.rider_id,
                r.username,
                r.area,
                r.lending_company,
                COALESCE(SUM(p.payment), 0) AS total_collected
            FROM rider_user r
            LEFT JOIN payments p
                ON p.rider_id = r.rider_id AND DATE(p.payment_date) = CURDATE()
            GROUP BY r.rider_id, r.username, r.area, r.lending_company
            ORDER BY total_collected DESC
            LIMIT 20;

        `;
        db.query(q, (err, res) => err ? reject(err) : resolve(res));
    }),

    todayCollection: () => new Promise((resolve, reject) => {
        const q = `SELECT SUM(payment) AS today_collection FROM payments WHERE DATE(payment_date) = CURDATE()`;
        db.query(q, (err, res) => err ? reject(err): resolve(res[0]));
    }),
    todayCollectionsCount: () => new Promise((resolve, reject) => {
        const q = `
            SELECT COUNT(*) AS total_collections
            FROM payments
            WHERE DATE(payment_date) = CURDATE()
        `;
        db.query(q, (err, res) => err ? reject(err) : resolve(res[0]));
    }),
    // todayCollectionsCountRider: (rider_id) => new Promise((resolve, reject) => {
    //     const q = `
    //         SELECT payment_date, NOW(), CURDATE()
    //         FROM payments
    //         WHERE rider_id = ?
    //         ORDER BY payment_date DESC
    //         LIMIT 5;
    //     `;
    //     db.query(q, [rider_id], (err, res) =>
    //         err ? reject(err) : resolve(res[0])
    //     );
    // }),
    monthlyRevenue: () => new Promise((resolve, reject) => {
        const q = `
            SELECT SUM(payment) AS total
            FROM payments
        `;
        db.query(q, (err, res) => {
            if (err) return reject(err);
            const total = res?.[0]?.total != null ? Number(res[0].total) : 0;
            resolve({ total });
        });
    }),
    loanCategories: () => new Promise((resolve, reject) => {
        const q = `SELECT SUM(CASE WHEN terms <= 30 THEN 1 ELSE 0 END) AS daily, SUM(CASE WHEN terms > 30 AND terms <= 60 THEN 1 ELSE 0 END) AS weekly, SUM(CASE WHEN terms > 60 THEN 1 ELSE 0 END) AS monthly FROM customer_user`;
        db.query(q, (err, res) => err ? reject(err): resolve(res[0]));
    }),
    riderSummary: (area, lending_company) => new Promise((resolve, reject) => {
        const q = `SELECT COUNT(*) AS customers, SUM(amount) AS total_loans, SUM(daily_pay) AS total_daily, MIN(loan_date) AS first_loan FROM customer_user WHERE area = ? AND lending_company = ?`;
        db.query(q, [area, lending_company], (err, result) => err ? reject(err) : resolve(result[0]));
    }),
    topRiders: () => new Promise((resolve, reject) => {
        const q = `...`; 
        db.query(`SELECT r.rider_id, r.username, r.area, r.lending_company, SUM(c.amount) AS total_collectibles, IFNULL((SELECT SUM(p.payment) FROM payments p JOIN customer_user cu ON cu.customer_id = p.customer_id WHERE cu.area = r.area AND cu.lending_company = r.lending_company), 0) AS total_collections, (IFNULL((SELECT SUM(p.payment) FROM payments p JOIN customer_user cu ON cu.customer_id = p.customer_id WHERE cu.area = r.area AND cu.lending_company = r.lending_company), 0) / SUM(c.amount)) * 100 AS efficiency_percentage FROM rider_user r LEFT JOIN customer_user c ON c.area = r.area AND c.lending_company = r.lending_company GROUP BY r.rider_id, r.username, r.area, r.lending_company ORDER BY efficiency_percentage DESC;`, (err, result) => err ? reject(err) : resolve(result));
    }),
    paymentStatusDistribution: () => new Promise((resolve, reject) => {
        const q = `
            SELECT 
                SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) AS paid,
                SUM(CASE WHEN payment_status = 'unpaid' OR payment_status = 'overdue' THEN 1 ELSE 0 END) AS missed
            FROM payments
        `;
        db.query(q, (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    }),
    paymentTodayStatusDistribution: () => new Promise((resolve, reject) => {
        const q = `
            SELECT 
                SUM(CASE WHEN payment_status = 'paid' THEN 1 ELSE 0 END) AS paid,
                SUM(CASE WHEN payment_status = 'unpaid' OR payment_status = 'overdue' THEN 1 ELSE 0 END) AS missed
            FROM payments
            WHERE DATE(payment_date) = CURDATE()
        `;
        db.query(q, (err, result) => {
            if (err) return reject(err);
            resolve(result[0]);
        });
    }),
    totalRevenue: () => new Promise((resolve, reject) => {
        const q = `SELECT SUM(payment) AS total FROM payments`;
        db.query(q, (err, res) => err ? reject(err) : resolve(res[0]));
    }),

    monthlyRevenue: () => new Promise((resolve, reject) => {
        const q = `
            SELECT MONTHNAME(payment_date) AS month, SUM(payment) AS total
            FROM payments
            GROUP BY MONTH(payment_date), MONTHNAME(payment_date)
            ORDER BY MONTH(payment_date)
        `;
        db.query(q, (err, res) => err ? reject(err) : resolve(res));
    }),

    totalRiders: () => new Promise((resolve, reject) => {
        const q = `SELECT COUNT(*) AS total_riders FROM rider_user`;
        db.query(q, (err, res) => err ? reject(err) : resolve(res[0]));
    }),

    totalAreas: () => new Promise((resolve, reject) => {
        const q = `SELECT COUNT(DISTINCT area) AS total_areas FROM customer_user`;
        db.query(q, (err, res) => err ? reject(err) : resolve(res[0]));
    }),

    totalCompanies: () => new Promise((resolve, reject) => {
        const q = `SELECT COUNT(DISTINCT lending_company) AS total_companies FROM customer_user`;
        db.query(q, (err, res) => err ? reject(err) : resolve(res[0]));
    }),
    totalOverdue: () => new Promise((resolve, reject) => {
        const q = `
            SELECT COUNT(payment) AS total_overdue
            FROM payments
            WHERE payment_status = 'overdue'
        `;
        db.query(q, (err, res) => err ? reject(err) : resolve(res[0]));
    }),
    topPerformingAreas: () => new Promise((resolve, reject) => {
        const q = `
            SELECT area, COUNT(*) AS total_customers
            FROM customer_user
            GROUP BY area
            ORDER BY total_customers DESC
        `;
        db.query(q, (err, res) => err ? reject(err) : resolve(res));
    }),
    recentActivities: () => new Promise((resolve, reject) => {
        const q = `
            (
                SELECT 
                    p.payment_id AS id,
                    'payment' AS type,
                    c.name AS customer,
                    p.payment AS amount,
                    p.payment_date AS activity_time
                FROM payments p
                JOIN customer_user c ON c.customer_id = p.customer_id
            )
            UNION ALL
            (
                SELECT
                    c.customer_id AS id,
                    'loan' AS type,
                    c.name AS customer,
                    c.amount AS amount,
                    c.loan_date AS activity_time
                FROM customer_user c
            )
            ORDER BY activity_time DESC
            LIMIT 10
        `;

        db.query(q, (err, res) => err ? reject(err) : resolve(res));
    }),
    monthlyAnalytics: (month) => {
        const selectedMonth = month || new Date().toISOString().slice(0, 7);

        const summaryQuery = `
            SELECT 
                IFNULL(SUM(p.payment), 0) AS totalRevenue,
                COUNT(p.payment_id) AS totalCollections,
                IFNULL(AVG(p.payment), 0) AS averageDaily,
                IFNULL((SUM(p.payment) / SUM(c.amount)) * 100, 0) AS collectionRate,
                COUNT(DISTINCT c.customer_id) AS newCustomers,
                COUNT(c.customer_id) AS loansDisbursed
            FROM customer_user c
            LEFT JOIN payments p 
                ON p.customer_id = c.customer_id
                AND DATE_FORMAT(p.payment_date, '%Y-%m') = ?
            WHERE DATE_FORMAT(c.loan_date, '%Y-%m') = ?
        `;

        const dailyTrendQuery = `
            SELECT 
                DATE(p.payment_date) AS date,
                SUM(p.payment) AS collections,
                COUNT(p.payment_id) AS payments,
                (SUM(p.payment) / SUM(c.daily_pay)) * 100 AS rate
            FROM payments p
            JOIN customer_user c ON c.customer_id = p.customer_id
            WHERE DATE_FORMAT(p.payment_date, '%Y-%m') = ?
            GROUP BY DATE(p.payment_date)
            ORDER BY DATE(p.payment_date)
        `;

        const companyPerformanceQuery = `
            SELECT 
                c.lending_company AS company,
                SUM(p.payment) AS revenue,
                COUNT(DISTINCT c.customer_id) AS customers,
                (SUM(p.payment) / SUM(c.amount)) * 100 AS rate
            FROM customer_user c
            LEFT JOIN payments p 
                ON p.customer_id = c.customer_id
                AND DATE_FORMAT(p.payment_date, '%Y-%m') = ?
            GROUP BY c.lending_company
            ORDER BY revenue DESC
        `;

        const areaGrowthQuery = `
            SELECT 
                c.area,
                SUM(p.payment) AS thisMonth
            FROM customer_user c
            LEFT JOIN payments p 
                ON p.customer_id = c.customer_id
                AND DATE_FORMAT(p.payment_date, '%Y-%m') = ?
            GROUP BY c.area
            ORDER BY thisMonth DESC
        `;

        const loanCategoriesQuery = `
        SELECT 
            -- Small loans
            SUM(CASE WHEN terms <= 30 THEN 1 ELSE 0 END) AS small_count,
            SUM(CASE WHEN terms <= 30 THEN amount ELSE 0 END) AS small_amount,
            AVG(CASE WHEN terms <= 30 THEN amount END) AS small_avg,

            -- Medium loans
            SUM(CASE WHEN terms BETWEEN 31 AND 60 THEN 1 ELSE 0 END) AS medium_count,
            SUM(CASE WHEN terms BETWEEN 31 AND 60 THEN amount ELSE 0 END) AS medium_amount,
            AVG(CASE WHEN terms BETWEEN 31 AND 60 THEN amount END) AS medium_avg,

            -- Large loans
            SUM(CASE WHEN terms > 60 THEN 1 ELSE 0 END) AS large_count,
            SUM(CASE WHEN terms > 60 THEN amount ELSE 0 END) AS large_amount,
            AVG(CASE WHEN terms > 60 THEN amount END) AS large_avg,

            -- Totals
            COUNT(*) AS total_loans,
            SUM(amount) AS total_amount,
            AVG(amount) AS overall_avg
        FROM customer_user
        `;

        const weeklyComparisonQuery = `
            SELECT 
                CONCAT('Week ', 
                    WEEK(p.payment_date, 1) 
                    - WEEK(DATE_SUB(p.payment_date, INTERVAL DAY(p.payment_date)-1 DAY), 1) 
                    + 1
                ) AS week,

                -- Selected month
                SUM(
                    CASE 
                        WHEN DATE_FORMAT(p.payment_date, '%Y-%m') = ?
                        THEN p.payment 
                        ELSE 0 
                    END
                ) AS thisMonth,

                -- Previous month
                SUM(
                    CASE 
                        WHEN DATE_FORMAT(p.payment_date, '%Y-%m') = DATE_FORMAT(DATE_SUB(CONCAT(?, '-01'), INTERVAL 1 MONTH), '%Y-%m')
                        THEN p.payment 
                        ELSE 0 
                    END
                ) AS lastMonth,

                -- Weekly target (7 days worth of daily pay)
                SUM(c.daily_pay) * 7 AS target

            FROM payments p
            JOIN customer_user c ON c.customer_id = p.customer_id
            WHERE DATE_FORMAT(p.payment_date, '%Y-%m') IN (
                ?,
                DATE_FORMAT(DATE_SUB(CONCAT(?, '-01'), INTERVAL 1 MONTH), '%Y-%m')
            )
            GROUP BY week
            ORDER BY week
        `;


        return Promise.all([
            query(summaryQuery, [selectedMonth, selectedMonth]),
            query(dailyTrendQuery, [selectedMonth]),
            query(companyPerformanceQuery, [selectedMonth]),
            query(areaGrowthQuery, [selectedMonth]),
            query(loanCategoriesQuery),
            query(weeklyComparisonQuery, [
                selectedMonth,
                selectedMonth,
                selectedMonth,
                selectedMonth
            ])
        ]).then(([
            summary,
            dailyTrend,
            companyPerformance,
            areaGrowth,
            loanCategories,
            weeklyComparison
        ]) => ({
            summary: summary[0],
            dailyTrend,
            companyPerformance,
            areaGrowth,
            loanCategories: loanCategories[0],
            weeklyComparison
        }));
        
    },
    getActiveLoanStats: async () => {
        try {
            const activeLoansQuery = `
                SELECT COUNT(DISTINCT c.customer_id) AS activeLoans
                FROM customer_user c
                JOIN payments p ON p.customer_id = c.customer_id
                WHERE p.payment_status IN ('unpaid', 'partial', 'overdue')
            `;

            const collectionRateQuery = `
                SELECT 
                    IFNULL((SUM(p.payment) / SUM(c.amount)) * 100, 0) AS collectionRate
                FROM customer_user c
                JOIN payments p ON p.customer_id = c.customer_id
                WHERE p.payment_status IN ('unpaid', 'partial', 'overdue')
            `;

            const [activeLoansResult, collectionRateResult] = await Promise.all([
                query(activeLoansQuery),
                query(collectionRateQuery)
            ]);

            return {
                activeLoans: activeLoansResult[0].activeLoans || 0,
                collectionRate: parseFloat(
                    Number(collectionRateResult[0].collectionRate || 0).toFixed(2)
                )

            };

        } catch (err) {
            console.error('Error fetching active loan stats:', err);
            throw err;
        }
    },
    getMonthlyRevenue: async (month) => {
        const selectedMonth = month || new Date().toISOString().slice(0, 7); // YYYY-MM

        const q = `
            SELECT SUM(payment) AS total
            FROM payments
            WHERE DATE_FORMAT(payment_date, '%Y-%m') = ?
        `;
        const result = await query(q, [selectedMonth]);
        return { monthlyRevenue: Number(result[0].total) || 0 };
    },
    
}