// src/components/Home.jsx
import React, { useEffect, useState } from "react";
import { User, Users, DollarSign, CheckCircle, XCircle, MapPin, Calendar, Award } from 'lucide-react';
import {
  fetchRiderFromToken,
  fetchRiderStats,
  fetchRecentPayments,
  fetchMissedPayments
} from '../../api/riderApi.js';

function Home() {
  const [riderProfile, setRiderProfile] = useState([]);

  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalCollectibles: 0,
    totalPayments: 0,
    totalMissedPayments: 0,
    efficiency: 0,
    todayCollections: 0,
    weeklyTarget: 150000.00, 
    collectedToday: 0
  });

  const [recentPayments, setRecentPayments] = useState([]);
  const [missedPayments, setMissedPayments] = useState([]);

  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) => {
    const num = Number(amount) || 0;
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP'
    }).format(num);
  };

  const timeAgo = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    const diff = Date.now() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    if (minutes < 1) return 'just now';
    if (minutes < 60) return `${minutes} mins ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    const days = Math.floor(hours / 24);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  };

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const rider = await fetchRiderFromToken();
        if (!isMounted) return;
        const profile = {
          name: rider.username || rider.name || 'No name',
          riderId: `RDR-${rider.rider_id}` || rider.rider_id,
          area: rider.area || '',
          joinDate: rider.created_at ? new Date(rider.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : '',
          phone: rider.phone || ''
        };
        setRiderProfile(profile);

        const riderId = rider.rider_id;
        const [rawStats, rawRecent, rawMissed] = await Promise.all([
          fetchRiderStats(riderId),
          fetchRecentPayments(riderId),
          fetchMissedPayments(riderId),
        ]);

        if (!isMounted) return;
        const totalCollectiblesNum = Number(rawStats.totalCollectibles) || 0;
        const monthlyCollectionNum = Number(rawStats.monthlyCollection || rawStats.monthlyCollection === 0 ? rawStats.monthlyCollection : 0) || 0;
        const todayCollectionNum = Number(rawStats.todayCollection) || 0;
        const totalPaymentsNum = monthlyCollectionNum;
        const totalMissed = Array.isArray(rawMissed) ? rawMissed.length : 0;
        const efficiencyVal = totalCollectiblesNum > 0 ? ((totalPaymentsNum / totalCollectiblesNum) * 100).toFixed(1) : 0;

        const mappedStats = {
          totalCustomers: rawStats.totalCustomers || 0,
          totalCollectibles: totalCollectiblesNum,
          totalPayments: totalPaymentsNum,
          totalMissedPayments: totalMissed,
          efficiency: Number(efficiencyVal),
          todayCollections: todayCollectionNum,
          weeklyTarget: stats.weeklyTarget || 150000.00, 
          collectedToday: todayCollectionNum
        };

        setStats(mappedStats);
        const mappedRecent = (Array.isArray(rawRecent) ? rawRecent : []).map((r) => ({
          id: r.payment_id,
          customer: r.name || r.customer_name || 'Unknown',
          amount: Number(r.payment) || 0,
          time: timeAgo(r.payment_date) || new Date(r.payment_date).toLocaleString(),
          status: r.payment_status || (Number(r.payment) > 0 ? 'completed' : 'missed')
        }));

        setRecentPayments(mappedRecent);
        const mappedMissed = (Array.isArray(rawMissed) ? rawMissed : []).map((m) => ({
          customer: m.name || m.customer_name || 'Unknown',
          amount: Number(m.daily_pay) || 0,
          daysOverdue: m.days_overdue ?? 'N/A'
        }));

        setMissedPayments(mappedMissed);

      } catch (err) {
        console.error("Failed loading dashboard data:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, []);

  const collectionProgress = (stats.totalCollectibles > 0)
    ? ( (Number(stats.totalPayments) / Number(stats.totalCollectibles)) * 100 )
    : 0;

  const weeklyProgress = (stats.weeklyTarget > 0)
    ? ( (Number(stats.collectedToday) / Number(stats.weeklyTarget)) * 100 )
    : 0;
  
  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1600px',
      margin: '0 auto',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh'
    }}>
      {/* Header with Profile */}
      <div style={{
        backgroundColor: 'white',
        padding: '1.5rem',
        borderRadius: '0.75rem',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
        border: '1px solid #e2e8f0',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          {/* Profile Photo */}
          <div style={{
            width: '5rem',
            height: '5rem',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '3px solid #dbeafe'
          }}>
            <User size={40} style={{ color: 'white' }} />
          </div>

          {/* Profile Info */}
          <div style={{ flex: 1 }}>
            <h1 style={{
              fontSize: '1.75rem',
              fontWeight: '700',
              color: '#1e293b',
              margin: '0 0 0.5rem 0'
            }}>
              {riderProfile.name}
            </h1>
            <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Award size={16} style={{ color: '#64748b' }} />
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>ID: {riderProfile.riderId}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} style={{ color: '#64748b' }} />
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Area: {riderProfile.area}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={16} style={{ color: '#64748b' }} />
                <span style={{ color: '#64748b', fontSize: '0.9rem' }}>Since {riderProfile.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Efficiency Badge */}
          <div style={{
            padding: '1rem 1.5rem',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            borderRadius: '0.75rem',
            textAlign: 'center'
          }}>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '0.8rem', margin: '0 0 0.25rem 0' }}>
              Efficiency Rate
            </p>
            <p style={{ color: 'white', fontSize: '2rem', fontWeight: '700', margin: '0' }}>
              {Number(stats.efficiency).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Show loading indicator inline if still loading */}
      {loading && <div style={{ marginBottom: '1rem', color: '#64748b' }}>Loading dashboard data...</div>}

      {/* Main Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        marginBottom: '2rem'
      }}>
        {/* Total Customers */}
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
              <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                {stats.totalCustomers}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Under your area
              </p>
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

        {/* Total Collectibles */}
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
                Total Collectibles
              </p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                {formatCurrency(stats.totalCollectibles)}
              </h2>
              <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '0.5rem' }}>
                Amount to collect
              </p>
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
              <DollarSign size={24} style={{ color: 'white' }} />
            </div>
          </div>
        </div>

        {/* Total Payments */}
        <div style={{
          backgroundColor: 'white',
          padding: '1.5rem',
          borderRadius: '0.75rem',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div style={{ flex: 1 }}>
              <p style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: '500', marginBottom: '0.5rem' }}>
                Total Payments
              </p>
              <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                {formatCurrency(stats.totalPayments)}
              </h2>
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{
                  width: '100%',
                  height: '0.5rem',
                  backgroundColor: '#e2e8f0',
                  borderRadius: '9999px',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${Math.max(0, Math.min(100, collectionProgress))}%`,
                    height: '100%',
                    background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                    borderRadius: '9999px'
                  }} />
                </div>
                <p style={{ color: '#22c55e', fontSize: '0.8rem', marginTop: '0.5rem', fontWeight: '500' }}>
                  {Number(collectionProgress).toFixed(1)}% collected
                </p>
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
              <CheckCircle size={24} style={{ color: 'white' }} />
            </div>
          </div>
        </div>

        {/* Missed Payments */}
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
                Missed Payments
              </p>
              <h2 style={{ fontSize: '2.5rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
                {stats.totalMissedPayments}
              </h2>
              <p style={{ color: '#ef4444', fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: '500' }}>
                Requires follow-up
              </p>
            </div>
            <div style={{
              width: '3rem',
              height: '3rem',
              borderRadius: '0.5rem',
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <XCircle size={24} style={{ color: 'white' }} />
            </div>
          </div>
        </div>
      </div>

      {/* Today's Performance */}
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
          marginBottom: '1rem'
        }}>
          Today's Performance
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Collections Made</p>
            <p style={{ fontSize: '1.75rem', fontWeight: '700', color: '#1e293b', margin: '0' }}>
              {stats.todayCollections}
            </p>
          </div>
          <div>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>Amount Collected</p>
            <p style={{ fontSize: '1.5rem', fontWeight: '700', color: '#22c55e', margin: '0' }}>
              {formatCurrency(stats.collectedToday)}
            </p>
          </div>
          <div style={{ gridColumn: 'span 2' }}>
            <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
              Weekly Target Progress
            </p>
            <div style={{
              width: '100%',
              height: '1.5rem',
              backgroundColor: '#e2e8f0',
              borderRadius: '9999px',
              overflow: 'hidden',
              position: 'relative'
            }}>
              <div style={{
                width: `${Math.max(0, Math.min(100, weeklyProgress))}%`,
                height: '100%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                borderRadius: '9999px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '0.5rem'
              }}>
                <span style={{ color: 'white', fontSize: '0.75rem', fontWeight: '600' }}>
                  {Number(weeklyProgress).toFixed(0)}%
                </span>
              </div>
            </div>
            <p style={{ color: '#64748b', fontSize: '0.8rem', marginTop: '0.5rem' }}>
              {formatCurrency(stats.collectedToday)} of {formatCurrency(stats.weeklyTarget)}
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Recent Payments */}
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
            Recent Payments Collected
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {recentPayments.length === 0 ? (
              <div style={{ color: '#64748b' }}>No recent payments.</div>
            ) : (
              recentPayments.map(payment => (
                <div key={payment.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: '#f0fdf4',
                  borderRadius: '0.5rem',
                  border: '1px solid #bbf7d0'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      backgroundColor: '#22c55e',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircle size={18} style={{ color: 'white' }} />
                    </div>
                    <div>
                      <p style={{ color: '#1e293b', fontWeight: '500', fontSize: '0.9rem', margin: '0' }}>
                        {payment.customer}
                      </p>
                      <p style={{ color: '#64748b', fontSize: '0.8rem', margin: '0' }}>
                        {payment.time}
                      </p>
                    </div>
                  </div>
                  <p style={{ color: '#16a34a', fontWeight: '700', fontSize: '1rem', margin: '0' }}>
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Missed Payments to Follow Up */}
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
            Missed Payments - Follow Up Required
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {missedPayments.length === 0 ? (
              <div style={{ color: '#64748b' }}>No missed payments.</div>
            ) : (
              missedPayments.map((payment, index) => (
                <div key={index} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  backgroundColor: '#fef2f2',
                  borderRadius: '0.5rem',
                  border: '1px solid #fecaca'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                      width: '2.5rem',
                      height: '2.5rem',
                      borderRadius: '50%',
                      backgroundColor: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <XCircle size={18} style={{ color: 'white' }} />
                    </div>
                    <div>
                      <p style={{ color: '#1e293b', fontWeight: '500', fontSize: '0.9rem', margin: '0' }}>
                        {payment.customer}
                      </p>
                      <p style={{ color: '#ef4444', fontSize: '0.8rem', margin: '0', fontWeight: '500' }}>
                        {payment.daysOverdue} days overdue
                      </p>
                    </div>
                  </div>
                  <p style={{ color: '#dc2626', fontWeight: '700', fontSize: '1rem', margin: '0' }}>
                    {formatCurrency(payment.amount)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
