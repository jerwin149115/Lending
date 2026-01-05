export const navData = [
    {
      name: 'Home',
      path: '/',
    },
    {
      name: 'Riders',
      submenu: [
        { name: 'Customer', path: '/dashboard/riders/customer' },
        { name: 'Rider', path: '/dashboard/riders'}
      ],
    },
    {
      name: 'Manage',
      submenu: [
        { name: 'Area', path: '/dashboard/manage/area' },
        { name: 'Company', path: '/dashboard/manage/company'}
      ],
    },
    // {
    //   name: 'Payment',
    //   submenu: [
    //     { name: 'Daily', path: '/dashboard/payment/daily'},
    //     { name: 'Monthly', path: '/dashboard/payment/monthly'}
    //   ]
    // }, 
    {
      name: 'Analytics',
      submenu: [
        { name: 'Daily', path: '/dashboard/analytics/daily'},
        { name: 'Monthly', path: '/dashboard/analytics/monthly'}
      ]
    },
    {
      name: 'Notifications',
      path: '/dashboard/notification/admin'
    },
    {
      name: 'Documents',
      path: '/dashboard/documents/admin'
    },
    {
      name: 'Logout',
      path: '/dashboard/logout'
    }
];
  