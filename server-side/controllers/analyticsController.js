const analyticsService = require('../services/analyticsService.js');

module.exports = {
    totalCustomers: async (req, res) => {
        try {
            const data = await analyticsService.totalCustomers();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    collectibles: async (req, res) => {
        try {
            const data = await analyticsService.collectibles();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    todayCollection: async (req, res) => {
        try {
            const data = await analyticsService.todayCollection();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },
    todayCollectionCount: async(req, res) => {
        try {
            const data = await analyticsService.todayCollectionsCount();
            res.json(data);
        } catch (error) {
            res.status(500).json({ error: 'Server Error'});
        }
    },
    // todayCollectionCountRider: async(req, res) => {
    //     try {
    //         const { rider_id } = req.user;
    //         const data = await analyticsService.todayCollectionsCountRider(rider_id);
    //         res.json(data);
    //     } catch (error) {
    //         res.status(500).json({ error: 'Server Error'});
    //     }
    // },
    monthlyRevenue: async (req, res) => {
        try {
            const data = await analyticsService.monthlyRevenue();
            res.json(data);
        } catch (err) {
            console.error('Monthly revenue error:', err);
            res.status(500).json({ error: 'Server Error' });
        }
    },

    loanCategories: async (req, res) => {
        try {
            const data = await analyticsService.loanCategories();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    riderSummary: async (req, res) => {
        try {
            const { area, lending_company } = req.query;
            const data = await analyticsService.riderSummary(area, lending_company);
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    topRiders: async (req, res) => {
        try {
            const data = await analyticsService.topRiders();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    paymentStatusDistribution: async (req, res) => {
        try {
            const data = await analyticsService.paymentStatusDistribution();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },
    paymentTodayStatusDistribution: async(req, res) => {
        try {
            const data = await analyticsService.paymentTodayStatusDistribution();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error'}); 
            console.error("err", err);
        }
    },
    totalRevenue: async (req, res) => {
        try {
            const data = await analyticsService.totalRevenue();
            res.json({ total: Number(data.total) || 0 });
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    totalRiders: async (req, res) => {
        try {
            const data = await analyticsService.totalRiders();
            res.json({ total: data.total_riders });
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    totalAreas: async (req, res) => {
        try {
            const data = await analyticsService.totalAreas();
            res.json({ total: data.total_areas });
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    totalCompanies: async (req, res) => {
        try {
            const data = await analyticsService.totalCompanies();
            res.json({ total: data.total_companies });
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    totalOverdue: async (req, res) => {
        try {
            const data = await analyticsService.totalOverdue();
            res.json({ total: data.total_overdue });
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    topPerformingAreas: async (req, res) => {
        try {
            const data = await analyticsService.topPerformingAreas();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    totalPayments: async (req, res) => {
        try {
            const data = await analyticsService.totalPayments();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    collectionRate: async (req, res) => {
        try {
            const data = await analyticsService.collectionRate();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    activeRidersToday: async (req, res) => {
        try {
            const data = await analyticsService.activeRidersToday();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    hourlyCollectionTrend: async (req, res) => {
        try {
            const data = await analyticsService.hourlyCollectionTrend();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    areaDailyPerformance: async (req, res) => {
        try {
            const data = await analyticsService.areaDailyPerformance();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },

    topPerformingRidersToday: async (req, res) => {
        try {
            const data = await analyticsService.topPerformingRidersToday();
            res.json(data);
        } catch (err) {
            res.status(500).json({ error: 'Server Error' });
        }
    },
    monthlyAnalytics: async (req, res) => {
        try {
            const data = await analyticsService.monthlyAnalytics(req.query.month);
            res.json(data);
        } catch (err) {
            console.error('Monthly analytics error:', err);
            res.status(500).json({ error: 'Server Error' });
        }
    },
    recentActivities: async (req, res) => {
        try {
            const data = await analyticsService.recentActivities();
            const formatted = data.map(a => ({
                id: `${a.type}-${a.id}`,
                type: a.type,
                customer: a.name || a.customer, 
                amount: Number(a.amount),
                time: new Date(a.activity_time).toLocaleString()
            }));

            res.json({ success: true, data: formatted });
        } catch (err) {
            console.error('Recent activities error:', err);
            res.status(500).json({ success: false, error: 'Server Error' });
        }
    },
    activeLoans: async (req, res) => {
        try {
            const stats = await analyticsService.getActiveLoanStats();
            res.json(stats);
        } catch (err) {
            console.error('Active loans error:', err);
            res.status(500).json({ error: 'Server Error' });
        }
    },
    monthlyRevenue: async (req, res) => {
        try {
            const month = req.query.month; 
            const data = await analyticsService.getMonthlyRevenue(month);
            res.json({
                success: true,
                month: month || new Date().toISOString().slice(0, 7),
                data
            });
        } catch (err) {
            console.error('Monthly revenue error:', err);
            res.status(500).json({ error: 'Server Error' });
        }
    },

};
