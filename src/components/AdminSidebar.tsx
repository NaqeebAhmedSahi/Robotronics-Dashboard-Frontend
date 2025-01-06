import * as React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { FaChartBar, FaChartLine, FaChartPie, FaGamepad, FaStopwatch, FaStar, FaUsers, FaUser, FaBlog, FaMoneyBillWave } from 'react-icons/fa';
import { MdContactMail } from 'react-icons/md'; 
import { HiMenuAlt4, HiOutlineDocumentText } from 'react-icons/hi';
import { IoIosPeople } from 'react-icons/io';
import { RiCoupon3Fill, RiDashboardFill, RiShoppingBag3Fill } from 'react-icons/ri';
import { SiCoursera } from 'react-icons/si';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]); 
  const [showModal, setShowModal] = React.useState<boolean>(false); 
  const [phoneActive, setPhoneActive] = React.useState<boolean>(window.innerWidth < 1000); 

  const resizeHandler = () => {
    setPhoneActive(window.innerWidth < 1000);
  };

  React.useEffect(() => {
    window.addEventListener('resize', resizeHandler);
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, []);

  const handleExpandedItemsChange = (event: React.SyntheticEvent, itemIds: string[]) => {
    setExpandedItems(itemIds);
  };

  const handleExpandClick = () => {
    // Keep all main items expanded when clicked, but only collapse if the expanded state is empty
    setExpandedItems((oldExpanded) => {
      if (oldExpanded.length === 0) {
        return ['dashboard', 'product', 'courses', 'roboGenius', 'charts', 'apps'];
      } else {
        // Do not collapse if there are child elements expanded
        return [];
      }
    });
  };

  const treeData = [
    {
      itemId: 'dashboard',
      label: 'Dashboard',
      icon: <RiDashboardFill />,
      path: '/admin/dashboard',
      children: [
        { itemId: 'myProfile', label: 'My Profile', icon: <FaUser />, path: '/admin/myProfile' },
        { itemId: 'product', label: 'Product', icon: <RiShoppingBag3Fill />, path: '/admin/product' },
        { itemId: 'courses', label: 'Courses', icon: <SiCoursera />, path: '/admin/courses' },
      ],
    },
    {
      itemId: 'roboGenius',
      label: 'RoboGenius',
      icon: <FaStar />,
      path: '/admin/robo_genius',
      children: [
        { itemId: 'roboGenParent', label: 'RoboGenius Parent', icon: <FaUsers />, path: '/admin/robo_genius' },
        { itemId: 'roboGenSchool', label: 'RoboGenius School', icon: <FaUsers />, path: '/admin/roboSchool' },
      ],
    },
    {
      itemId: 'charts',
      label: 'Charts',
      icon: <FaChartBar />,
      path: '/admin/chart/bar',
      children: [
        { itemId: 'bar', label: 'Bar', icon: <FaChartBar />, path: '/admin/chart/bar' },
        { itemId: 'pie', label: 'Pie', icon: <FaChartPie />, path: '/admin/chart/pie' },
        { itemId: 'line', label: 'Line', icon: <FaChartLine />, path: '/admin/chart/line' },
      ],
    },
    {
      itemId: 'apps',
      label: 'Apps',
      icon: <FaGamepad />,
      path: '/admin/app/stopwatch',
      children: [
        { itemId: 'stopwatch', label: 'Stopwatch', icon: <FaStopwatch />, path: '/admin/app/stopwatch' },
        { itemId: 'coupon', label: 'Coupon', icon: <RiCoupon3Fill />, path: '/admin/app/coupon' },
      ],
    },
    {
      itemId: 'customers',
      label: 'Customer',
      icon: <IoIosPeople />,
      path: '/admin/customer',
      children: [],
    },
    {
      itemId: 'users',
      label: 'Users',
      icon: <FaUsers />,
      path: '/admin/users',
      children: [],
    },
    {
      itemId: 'contact',
      label: 'Contact',
      icon: <MdContactMail />,
      path: '/admin/contact',
      children: [],
    },
    {
      itemId: 'blogs',
      label: 'Blogs',
      icon: <FaBlog />,
      path: '/admin/blogs',
      children: [],
    },
    {
      itemId: 'financial',
      label: 'Financial',
      icon: <FaMoneyBillWave />,
      path: '/admin/Financial',
      children: [],
    },
    {
      itemId: 'reports',
      label: 'Reports',
      icon: <HiOutlineDocumentText />,
      path: '/reports',
      children: [],
    },
	{
		itemId: 'JobApplication',
		label: 'Job Application',
		icon: <HiOutlineDocumentText />,
		path: '/admin/JobApplications',
		children: [],
	  },
	  {
		itemId: 'VideoGallery',
		label: 'Video Gallery',
		icon: <HiOutlineDocumentText />,
		path: '/admin/VideoGallery',
		children: [],
	  },
  ];

  const CustomLabel = ({ icon, label, path }: { icon: React.ReactNode; label: string; path: string }) => (
    <Stack direction="row" spacing={1} alignItems="center">
      {icon}
      <Link to={path} style={{ textDecoration: 'none', color: 'inherit' }}>
        <span
          style={{
            fontSize: '1rem',
            padding: '10px 20px',
            fontWeight: '500',
            lineHeight: '1.6',
            display: 'inline-block',
          }}
        >
          {label}
        </span>
      </Link>
    </Stack>
  );

  return (
    <>
      {phoneActive && (
        <button id="hamburger" onClick={() => setShowModal(true)} style={{ fontSize: '1.5rem', padding: '10px' }}>
          <HiMenuAlt4 />
        </button>
      )}

      <aside
        style={
          phoneActive
            ? {
                width: '20rem',
                height: '100vh',
                position: 'fixed',
                top: 0,
                left: showModal ? '0' : '-20rem',
                transition: 'all 0.5s',
                padding: '20px',
                backgroundColor: '#1a202c',
                color: '#fff',
                fontSize: '1.1rem',
              }
            : {}
        }
      >
        <Stack spacing={2}>
          <div>
            <Button
              onClick={handleExpandClick}
              style={{
                fontSize: '0.rem',
                // padding: '10px 20px',
                color: '#fff',
                backgroundColor: '#2b6cb0',
                borderRadius: '4px',
              }}
            >
              {expandedItems.length === 0 ? 'Expand all' : 'Collapse all'}
            </Button>
          </div>
          <Box sx={{ minHeight: 352, minWidth: 250 }}>
            <SimpleTreeView expandedItems={expandedItems} onExpandedItemsChange={handleExpandedItemsChange}>
              {treeData.map((item) => (
                <TreeItem key={item.itemId} itemId={item.itemId} label={<CustomLabel icon={item.icon} label={item.label} path={item.path} />}>
                  {item.children &&
                    item.children.map((child) => (
                      <TreeItem key={child.itemId} itemId={child.itemId} label={<CustomLabel icon={child.icon} label={child.label} path={child.path} />} />
                    ))}
                </TreeItem>
              ))}
            </SimpleTreeView>
          </Box>
        </Stack>

        {phoneActive && (
          <button
            id="close-sidebar"
            onClick={() => setShowModal(false)}
            style={{
              fontSize: '1.5rem',
              padding: '10px',
              color: '#fff',
              backgroundColor: '#e53e3e',
            }}
          >
            Close
          </button>
        )}
      </aside>
    </>
  );
};

export default AdminSidebar;
