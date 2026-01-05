import { useState, useEffect } from 'react';
import { Users, DollarSign, MapPin, Building2, TrendingUp, Calendar, CreditCard, AlertCircle } from 'lucide-react';

function Home() {
  const API_BASE = `http://localhost:3000/api`
  const [totalCustomers, setTotalCustomers] = useState(0)
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalRiders: 0,
    totalAreas: 0,
    totalCompanies: 0,
    totalRevenue: 0,
    monthlyRevenue: 0,
    activeLoans: 0,
    pendingPayments: 0,
    collectionRate: 0,
    overdueLoans: 0
  });

  const [recentActivities, setRecentActivities] = useState([]);
  const [topAreas, setTopAreas] = useState([]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(amount);
  };

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [
          customersRes,
          ridersRes,
          areasRes,
          companiesRes,
          totalRevenueRes,
          monthlyRevenueRes,
          overdueRes,
          topAreasRes,
          recentActivitiesRes,
          activeLoansRes
        ] = await Promise.all([
          fetch(`${API_BASE}/analytics/total/customers`),
          fetch(`${API_BASE}/analytics/total/riders`),
          fetch(`${API_BASE}/analytics/total/areas`),
          fetch(`${API_BASE}/analytics/total/companies`),
          fetch(`${API_BASE}/analytics/total/revenue`),
          fetch(`${API_BASE}/analytics/monthly/revenue`), // <-- monthly revenue endpoint
          fetch(`${API_BASE}/analytics/total/overdue`),
          fetch(`${API_BASE}/analytics/top/areas`),
          fetch(`${API_BASE}/analytics/recent-activities`),
          fetch(`${API_BASE}/analytics/active-loans`)
        ]);

        const [
          customers,
          riders,
          areas,
          companies,
          totalRevenue,
          monthlyRevenue,
          overdue,
          topAreasData,
          recentActivitiesData,
          activeLoans
        ] = await Promise.all([
          customersRes.json(),
          ridersRes.json(),
          areasRes.json(),
          companiesRes.json(),
          totalRevenueRes.json(),
          monthlyRevenueRes.json(),
          overdueRes.json(),
          topAreasRes.json(),
          recentActivitiesRes.json(),
          activeLoansRes.json()
        ]);

        setStats(prev => ({
          ...prev,
          totalCustomers: customers.total || 0,
          totalRiders: riders.total || 0,
          totalAreas: areas.total || 0,
          totalCompanies: companies.total || 0,
          totalRevenue: totalRevenue.total || 0,
          monthlyRevenue: monthlyRevenue.data?.monthlyRevenue || 0, // <-- use data.monthlyRevenue
          overdueLoans: overdue.total || 0,
          activeLoans: activeLoans.activeLoans || 0,
          collectionRate: activeLoans.collectionRate || 0
        }));

        const totalCustomersCount = customers.total || 0;
        const topAreasWithMetrics = topAreasData.map(area => {
          const revenue = area.total_customers * 1000;
          const percentage =
            totalCustomersCount > 0
              ? ((area.total_customers / totalCustomersCount) * 100).toFixed(2)
              : 0;

          return {
            ...area,
            revenue,
            percentage
          };
        });

        setTopAreas(topAreasWithMetrics);
        setRecentActivities(recentActivitiesData.data || []);

      } catch (error) {
        console.error('Failed to fetch analytics:', error);
      }
    };

    fetchAnalytics();
  }, []);


  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1600px',
      margin: '0 auto',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }}>
      <div style={{
        marginBottom: '2rem'
      }}>
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          color: '#1e293b',
          marginBottom: '0.5rem'
        }}>
          Dashboard Overview
        </h1>
        <p style={{
          color: '#64748b',
          fontSize: '0.95rem'
        }}>
          Welcome back! Here's what's happening with your lending business today.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
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
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                {formatCurrency(stats.totalRevenue)}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                <TrendingUp size={16} style={{ color: '#22c55e' }} />
                <span style={{ color: '#22c55e', fontSize: '0.85rem', fontWeight: '500' }}>+12.5%</span>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>vs last month</span>
              </div>
            </div>
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <DollarSign size={24} style={{ color: 'white' }} />
            </div>
          </div>
        </div>

        {/* Monthly Revenue Card */}
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
                Monthly Revenue
              </p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                {formatCurrency(stats.monthlyRevenue)}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                <Calendar size={16} style={{ color: '#3b82f6' }} />
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>December 2024</span>
              </div>
            </div>
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Calendar size={24} style={{ color: 'white' }} />
            </div>
          </div>
        </div>

        {/* Total Customers Card */}
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
                Total Customers
              </p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                {stats.totalCustomers.toLocaleString()}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                <span style={{ color: '#22c55e', fontSize: '0.85rem', fontWeight: '500' }}>+48</span>
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>new this month</span>
              </div>
            </div>
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={24} style={{ color: 'white' }} />
            </div>
          </div>
        </div>

        {/* Active Loans Card */}
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
                Active Loans
              </p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                {stats.activeLoans.toLocaleString()}
              </h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Collection Rate:</span>
                <span style={{ color: '#22c55e', fontSize: '0.85rem', fontWeight: '500' }}>{stats.collectionRate}%</span>
              </div>
            </div>
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CreditCard size={24} style={{ color: 'white' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Secondary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          padding: '1.25rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.5rem',
            backgroundColor: '#dbeafe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Users size={20} style={{ color: '#3b82f6' }} />
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0' }}>Riders</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>{stats.totalRiders}</p>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.25rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.5rem',
            backgroundColor: '#fef3c7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <MapPin size={20} style={{ color: '#f59e0b' }} />
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0' }}>Areas</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>{stats.totalAreas}</p>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.25rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.5rem',
            backgroundColor: '#ddd6fe',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Building2 size={20} style={{ color: '#8b5cf6' }} />
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0' }}>Companies</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>{stats.totalCompanies}</p>
          </div>
        </div>

        <div style={{
          backgroundColor: 'white',
          padding: '1.25rem',
          borderRadius: '0.5rem',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.06)',
          border: '1px solid #e2e8f0',
          display: 'flex',
          alignItems: 'center',
          gap: '1rem'
        }}>
          <div style={{
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.5rem',
            backgroundColor: '#fee2e2',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <AlertCircle size={20} style={{ color: '#ef4444' }} />
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0' }}>Overdue</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>{stats.overdueLoans}</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Recent Activities */}
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
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '2px solid #e2e8f0'
          }}>
            Recent Activities
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentActivities.map(activity => (
              <div key={activity.id} style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.75rem',
                backgroundColor: '#f8fafc',
                borderRadius: '0.5rem',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    backgroundColor: activity.type === 'payment' ? '#dcfce7' : '#dbeafe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    {activity.type === 'payment' ? (
                      <DollarSign size={18} style={{ color: '#16a34a' }} />
                    ) : (
                      <CreditCard size={18} style={{ color: '#2563eb' }} />
                    )}
                  </div>
                  <div>
                    <p style={{ color: '#1e293b', fontWeight: '500', fontSize: '0.9rem', margin: '0' }}>
                      {activity.customer}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0' }}>
                      {activity.type === 'payment' ? 'Payment received' : 'New loan'}
                    </p>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <p style={{ color: activity.type === 'payment' ? '#16a34a' : '#2563eb', fontWeight: '600', fontSize: '0.9rem', margin: '0' }}>
                    {formatCurrency(activity.amount)}
                  </p>
                  <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: '0' }}>
                    {activity.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Areas */}
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
            marginBottom: '1.25rem',
            paddingBottom: '0.75rem',
            borderBottom: '2px solid #e2e8f0'
          }}>
            Top Performing Areas
          </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {topAreas.map((area, index) => (
                <div
                  key={index}
                  style={{
                    padding: '1rem',
                    backgroundColor: '#f8fafc',
                    borderRadius: '0.5rem',
                    border: '1px solid #e2e8f0'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '0.5rem'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div
                        style={{
                          width: '1.75rem',
                          height: '1.75rem',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: 'white',
                          fontSize: '0.8rem',
                          fontWeight: '600'
                        }}
                      >
                        {index + 1}
                      </div>

                      <div>
                        {/* ✅ AREA NAME ONLY */}
                        <p
                          style={{
                            color: '#1e293b',
                            fontWeight: '600',
                            fontSize: '0.9rem',
                            margin: '0'
                          }}
                        >
                          {area.area}
                        </p>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <p
                        style={{
                          color: '#1e293b',
                          fontWeight: '600',
                          fontSize: '0.9rem',
                          margin: '0'
                        }}
                      >
                        {formatCurrency(area.revenue)}
                      </p>
                      <p
                        style={{
                          color: '#22c55e',
                          fontSize: '0.8rem',
                          margin: '0'
                        }}
                      >
                        {area.percentage}%
                      </p>
                    </div>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      height: '0.375rem',
                      backgroundColor: '#e2e8f0',
                      borderRadius: '9999px',
                      overflow: 'hidden'
                    }}
                  >
                    <div
                      style={{
                        width: `${area.percentage}%`,
                        height: '100%',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                        borderRadius: '9999px'
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

        </div>
      </div>
    </div>
  );
}

export default Home;