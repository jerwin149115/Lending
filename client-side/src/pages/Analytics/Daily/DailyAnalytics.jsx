import { useState, useEffect } from 'react';
import { Calendar, TrendingUp, Users, DollarSign, MapPin, CheckCircle, XCircle, Clock } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

function DailyAnalytics() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [dailyStats, setDailyStats] = useState({});
  const [hourlyData, setHourlyData] = useState([]);
  const [areaPerformance, setAreaPerformance] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState([]);
  const [topRiders, setTopRiders] = useState([]);
  const API_BASE = `http://localhost:3000/api`

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
      minimumFractionDigits: 2
    }).format(amount);
  };

  useEffect(() => {
    fetchDailyAnalytics();
  }, [selectedDate]);

  const fetchDailyAnalytics = async () => {
    try {
      const endpoints = [
        'http://localhost:3000/api/analytics/today/collection',
        'http://localhost:3000/api/analytics/get/today/count',
        'http://localhost:3000/api/analytics/today/payment-status-distribution',
        'http://localhost:3000/api/analytics/active-riders/today',
        'http://localhost:3000/api/analytics/collection-rate',
        'http://localhost:3000/api/analytics/trends/hourly-collection',
        'http://localhost:3000/api/analytics/performance/area-daily',
        'http://localhost:3000/api/analytics/top/riders-today'
      ];

      const responses = await Promise.all(
        endpoints.map(url => fetch(url))
      );

      responses.forEach(res => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.url}`);
        }
      });

      const [
        todayCollection,
        totalPayments,
        paymentStatusRes,
        activeRidersRes,
        collectionRateRes,
        hourlyTrendRes,
        areaDailyRes,
        topRidersTodayRes
      ] = await Promise.all(responses.map(res => res.json()));

      const totalCollections = Number(todayCollection.today_collection || 0);
      const totalPaymentsCount = Number(totalPayments?.total_collections || 0);
      const paidCount = Number(paymentStatusRes.paid || 0);
      const missedCount = Number(paymentStatusRes.missed || 0);

      setDailyStats({
        totalCollections,
        totalPayments: totalPaymentsCount,
        successfulPayments: paidCount,
        missedPayments: missedCount,
        activeRiders: Number(activeRidersRes.active_riders || 0),
        areasVisited: areaDailyRes.length,
        collectionRate: Number(collectionRateRes.collection_rate || 0).toFixed(1),
        averagePayment:
          totalPaymentsCount > 0
            ? (totalCollections / totalPaymentsCount).toFixed(2)
            : 0
      });

      setHourlyData(
        hourlyTrendRes.map(item => ({
          hour: `${item.hour}:00`,
          collections: Number(item.total)
        }))
      );

      setAreaPerformance(
        areaDailyRes.map(area => ({
          area: area.area,
          collected: Number(area.collected),
          payments: Number(area.payments || 0)
        }))
      );

      setPaymentStatus([
        { name: 'Paid', value: paidCount, color: '#22c55e' },
        { name: 'Missed', value: missedCount, color: '#ef4444' }
      ]);

      setTopRiders(
        topRidersTodayRes.map((rider, index) => ({
          name: rider.username,
          collections: Number(rider.total_collected),
          payments: Number(rider.total_payments || 0),
          efficiency: rider.efficiency_percentage
            ? Number(rider.efficiency_percentage).toFixed(0)
            : 100
        }))
      );

    } catch (error) {
      console.error('❌ Failed to load daily analytics:', error);
    }
  };



  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: 'white',
          padding: '0.75rem',
          border: '1px solid #e2e8f0',
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
        }}>
          <p style={{ margin: 0, color: '#1e293b', fontWeight: '600', fontSize: '0.85rem' }}>
            {payload[0].payload.hour || payload[0].payload.area}
          </p>
          {payload.map((entry, index) => (
            <p key={index} style={{ margin: '0.25rem 0', color: entry.color, fontSize: '0.8rem' }}>
              {entry.name}: {entry.name.includes('collections') || entry.name.includes('collected')
                ? formatCurrency(entry.value) 
                : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
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
            Daily Analytics
          </h1>
          <p style={{
            color: '#64748b',
            fontSize: '0.95rem'
          }}>
            Detailed collection analysis and performance metrics
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
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
                Total Collections
              </p>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                {formatCurrency(dailyStats.totalCollections)}
              </h2>
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
                Total Payments
              </p>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                {dailyStats.totalPayments}
              </h2>
              <p style={{ color: '#22c55e', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {dailyStats.successfulPayments} successful
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
              <CheckCircle size={22} style={{ color: 'white' }} />
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
                {dailyStats.collectionRate}%
              </h2>
              <p style={{ color: '#ef4444', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {dailyStats.missedPayments} missed
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
              <TrendingUp size={22} style={{ color: 'white' }} />
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
                Active Riders
              </p>
              <h2 style={{ fontSize: '1.6rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                {dailyStats.activeRiders}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                {dailyStats.areasVisited} areas covered
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

      {/* Charts Row */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Hourly Collections Chart */}
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
            Hourly Collections Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="hour" stroke="#64748b" style={{ fontSize: '0.8rem' }} />
              <YAxis stroke="#64748b" style={{ fontSize: '0.8rem' }} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
              <Line type="monotone" dataKey="collections" stroke="#3b82f6" strokeWidth={2} name="Collections (PHP)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Pie Chart */}
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
            Payment Status Distribution
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentStatus}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {paymentStatus.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Area Performance Chart */}
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
          Area Performance
        </h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={areaPerformance}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="area" stroke="#64748b" style={{ fontSize: '0.8rem' }} />
            <YAxis stroke="#64748b" style={{ fontSize: '0.8rem' }} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: '0.85rem' }} />
            <Bar dataKey="collected" fill="#22c55e" name="Collected (PHP)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

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
          Top Performing Riders Today
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1rem'
        }}>
          {topRiders.map((rider, index) => (
            <div key={index} style={{
              padding: '1.25rem',
              backgroundColor: '#f8fafc',
              borderRadius: '0.5rem',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontWeight: '700'
                }}>
                  #{index + 1}
                </div>
                <div>
                  <p style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.95rem', margin: '0' }}>
                    {rider.name}
                  </p>
                  <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0' }}>
                    {rider.payments} payments collected
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Collections</span>
                <span style={{ color: '#1e293b', fontWeight: '600', fontSize: '0.85rem' }}>
                  {formatCurrency(rider.collections)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#64748b', fontSize: '0.85rem' }}>Efficiency</span>
                <span style={{ 
                  color: rider.efficiency >= 95 ? '#22c55e' : rider.efficiency >= 90 ? '#f59e0b' : '#ef4444',
                  fontWeight: '600',
                  fontSize: '0.85rem'
                }}>
                  {rider.efficiency}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default DailyAnalytics;