import { useState, useEffect } from 'react';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Target,
  Award,
  AlertTriangle
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

const API_BASE = 'http://localhost:3000';

function MonthlyAnalytics() {
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );
  const [weeklyComparison, setWeeklyComparison] = useState([]);
  const [loading, setLoading] = useState(true);
  const [monthlyStats, setMonthlyStats] = useState({});
  const [dailyTrend, setDailyTrend] = useState([]);
  const [companyPerformance, setCompanyPerformance] = useState([]);
  const [areaGrowth, setAreaGrowth] = useState([]);
  const [loanCategories, setLoanCategories] = useState([]);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `http://localhost:3000/api/analytics/monthly?month=${selectedMonth}`
        );
        const data = await res.json();

        setMonthlyStats({
          totalRevenue: Number(data.summary.totalRevenue),
          totalCollections: Number(data.summary.totalCollections),
          averageDaily: Number(data.summary.averageDaily),
          collectionRate: Number(data.summary.collectionRate),
          newCustomers: Number(data.summary.newCustomers),
          loansDisbursed: Number(data.summary.loansDisbursed)
        });

        setDailyTrend(
          data.dailyTrend.map(d => ({
            date: new Date(d.date).toLocaleDateString('en-PH', {
              month: 'short',
              day: 'numeric'
            }),
            collections: Number(d.collections),
            payments: Number(d.payments),
            rate: Number(d.rate)
          }))
        );

        setCompanyPerformance(
          data.companyPerformance.map(c => ({
            company: c.company,
            revenue: Number(c.revenue),
            customers: Number(c.customers),
            rate: Number(c.rate)
          }))
        );

        setAreaGrowth(
          data.areaGrowth.map(a => ({
            area: a.area,
            thisMonth: Number(a.thisMonth)
          }))
        );

        setLoanCategories([
          {
            category: 'Small',
            count: Number(data.loanCategories.small_count),
            amount: Number(data.loanCategories.small_amount),
            avgSize: Number(data.loanCategories.small_avg)
          },
          {
            category: 'Medium',
            count: Number(data.loanCategories.medium_count),
            amount: Number(data.loanCategories.medium_amount),
            avgSize: Number(data.loanCategories.medium_avg)
          },
          {
            category: 'Large',
            count: Number(data.loanCategories.large_count),
            amount: Number(data.loanCategories.large_amount),
            avgSize: Number(data.loanCategories.large_avg)
          }
        ]);

        // ✅ WEEKLY COMPARISON (NEW)
        setWeeklyComparison(
          (data.weeklyComparison || []).map(w => ({
            week: w.week,
            thisMonth: Number(w.thisMonth),
            lastMonth: Number(w.lastMonth),
            target: Number(w.target)
          }))
        );

      } catch (err) {
        console.error('Monthly analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [selectedMonth]);



  const formatCurrency = (amount = 0) => {
    if (isNaN(amount)) return '₱0';
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const CustomTooltip = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const label =
      payload[0]?.payload?.date ||
      payload[0]?.payload?.week ||
      payload[0]?.payload?.area ||
      '';

    return (
      <div
        style={{
          backgroundColor: '#fff',
          padding: '0.75rem',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem'
        }}
      >
        <p style={{ fontWeight: 600 }}>{label}</p>
        {payload.map((entry, i) => (
          <p key={i} style={{ fontSize: '0.8rem' }}>
            {entry.name}:{' '}
            {typeof entry.value === 'number'
              ? formatCurrency(entry.value)
              : entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1600px',
      margin: '0 auto',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        <div>
          <h1 style={{
            fontSize: '2rem',
            fontWeight: '700',
            color: '#1e293b',
            marginBottom: '0.5rem'
          }}>
            Monthly Analytics
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '0.95rem'
          }}>
            Comprehensive monthly performance and trend analysis
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input
            type="month"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              border: '1px solid #cbd5e1',
              borderRadius: '0.5rem',
              backgroundColor: 'white',
              color: '#334155',
              fontSize: '0.9rem',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

      {/* Main Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Total Revenue
              </p>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                {formatCurrency(monthlyStats.totalRevenue ?? 0)}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
                <TrendingUp size={14} style={{ color: '#22c55e' }} />
                <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: '500' }}>
                  +{monthlyStats.growthRate}%
                </span>
              </div>
            </div>
            <div style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={22} style={{ color: 'white' }} />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Total Collections
              </p>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                {(monthlyStats.totalCollections ?? 0).toLocaleString()}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Avg: {(monthlyStats.totalCollections ?? 0).toLocaleString()} per day
              </p>
            </div>
            <div style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target size={22} style={{ color: 'white' }} />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Collection Rate
              </p>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                {monthlyStats.collectionRate
                ? `${monthlyStats.collectionRate.toFixed(2)}%`
                : '0%'}
              </h2>
              <p style={{ color: '#22c55e', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                Above target (90%)
              </p>
            </div>
            <div style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Award size={22} style={{ color: 'white' }} />
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                New Customers
              </p>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                {monthlyStats.newCustomers}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {monthlyStats.loansDisbursed} loans disbursed
              </p>
            </div>
            <div style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={22} style={{ color: 'white' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Daily Collections Trend */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '1.5rem',
          paddingBottom: '0.75rem',
          borderBottom: '2px solid #e2e8f0'
        }}>
          Daily Collections & Rate Trend
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={dailyTrend}>
            <defs>
              <linearGradient id="colorCollections" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="date" stroke="#64748b" style={{ fontSize: '0.8rem' }} />
            <YAxis yAxisId="left" stroke="#64748b" style={{ fontSize: '0.8rem' }} />
            <YAxis yAxisId="right" orientation="right" stroke="#64748b" style={{ fontSize: '0.8rem' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
            <Area 
              yAxisId="left"
              type="monotone" 
              dataKey="collections" 
              stroke="#3b82f6" 
              fillOpacity={1}
              fill="url(#colorCollections)"
              name="Collections (PHP)"
            />
            <Line 
              yAxisId="right"
              type="monotone" 
              dataKey="rate" 
              stroke="#22c55e" 
              strokeWidth={2}
              name="Collection Rate (%)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Weekly Comparison */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem'
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '1.5rem',
          paddingBottom: '0.75rem',
          borderBottom: '2px solid #e2e8f0'
        }}>
          Weekly Performance Comparison
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={weeklyComparison}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="week" stroke="#64748b" style={{ fontSize: '0.8rem' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '0.8rem' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
            <Bar dataKey="thisMonth" fill="#3b82f6" name="This Month (PHP)" />
            <Bar dataKey="lastMonth" fill="#94a3b8" name="Last Month (PHP)" />
            <Bar dataKey="target" fill="#f59e0b" name="Target (PHP)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Company Performance & Area Growth */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Company Performance */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1.5rem',
            paddingBottom: '0.75rem',
            borderBottom: '2px solid #e2e8f0'
          }}>
            Company Performance
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {companyPerformance.map((company, index) => (
              <div key={index} style={{
                padding: '1.25rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <h4 style={{ margin: 0, color: '#1e293b', fontSize: '0.95rem', fontWeight: '600' }}>
                    {company.company}
                  </h4>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <TrendingUp size={14} style={{ color: '#22c55e' }} />
                    <span style={{ color: '#22c55e', fontSize: '0.8rem', fontWeight: '600' }}>
                      +{company.growth}%
                    </span>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', fontSize: '0.85rem' }}>
                  <div>
                    <p style={{ margin: 0, color: '#64748b' }}>Revenue</p>
                    <p style={{ margin: 0, color: '#1e293b', fontWeight: '600' }}>
                      {formatCurrency(company.revenue)}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, color: '#64748b' }}>Customers</p>
                    <p style={{ margin: 0, color: '#1e293b', fontWeight: '600' }}>
                      {company.customers}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, color: '#64748b' }}>Collection Rate</p>
                    <p style={{ margin: 0, color: company.rate >= 95 ? '#22c55e' : '#f59e0b', fontWeight: '600' }}>
                      {company.rate}%
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Area Growth */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{
            fontSize: '1.1rem',
            fontWeight: '600',
            color: '#1e293b',
            marginBottom: '1.5rem',
            paddingBottom: '0.75rem',
            borderBottom: '2px solid #e2e8f0'
          }}>
            Area Growth Comparison
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {areaGrowth.map((area, index) => (
              <div key={index} style={{
                padding: '1rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <h4 style={{ margin: 0, color: '#1e293b', fontSize: '0.9rem', fontWeight: '600' }}>
                    {area.area}
                  </h4>
                  <span style={{ 
                    color: area.growth >= 12 ? '#22c55e' : area.growth >= 8 ? '#f59e0b' : '#ef4444',
                    fontSize: '0.85rem',
                    fontWeight: '600'
                  }}>
                    {area.growth > 0 ? '+' : ''}{area.growth}%
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem' }}>
                  <div>
                    <p style={{ margin: 0, color: '#64748b' }}>This Month</p>
                    <p style={{ margin: 0, color: '#1e293b', fontWeight: '600' }}>
                      {formatCurrency(area.thisMonth)}
                    </p>
                  </div>
                  <div>
                    <p style={{ margin: 0, color: '#64748b' }}>Last Month</p>
                    <p style={{ margin: 0, color: '#64748b', fontWeight: '600' }}>
                      {formatCurrency(area.lastMonth)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loan Categories */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#1e293b',
          marginBottom: '1.5rem',
          paddingBottom: '0.75rem',
          borderBottom: '2px solid #e2e8f0'
        }}>
          Loan Distribution by Size
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '1.5rem'
        }}>
          {loanCategories.map((category, index) => (
            <div key={index} style={{
              padding: '1.5rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1rem', fontWeight: '600' }}>
                {category.category}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Total Loans</span>
                  <span style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>
                    {(category.count ?? 0).toLocaleString()}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Total Amount</span>
                  <span style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.9rem' }}>
                    {formatCurrency(category.amount)}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Average Size</span>
                  <span style={{ color: '#3b82f6', fontWeight: '600', fontSize: '0.9rem' }}>
                    {formatCurrency(category.avgSize)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MonthlyAnalytics;