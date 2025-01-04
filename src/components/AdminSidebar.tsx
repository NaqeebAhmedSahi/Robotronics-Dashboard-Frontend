/* eslint-disable no-mixed-spaces-and-tabs */
import { useEffect, useState } from "react";
import { IconType } from "react-icons";
import { AiFillFileText } from "react-icons/ai";
import { FaChartBar, FaChartLine, FaChartPie, FaGamepad, FaStopwatch, FaStar, FaUsers, FaUser, FaBlog,FaMoneyBillWave } from "react-icons/fa";
import { MdContactMail } from "react-icons/md"; // Import MdContactMail for Contact Icon
import { HiMenuAlt4 } from "react-icons/hi";
import { IoIosPeople } from "react-icons/io";
import { RiCoupon3Fill, RiDashboardFill, RiShoppingBag3Fill } from "react-icons/ri";
import { SiCoursera } from "react-icons/si";
import { Link, Location, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";

const AdminSidebar = () => {
	const location = useLocation();

	const [showModal, setShowModal] = useState<boolean>(false);
	const [phoneActive, setPhoneActive] = useState<boolean>(window.innerWidth < 1000);

	const resizeHandler = () => {
		setPhoneActive(window.innerWidth < 1000);
	};

	useEffect(() => {
		window.addEventListener("resize", resizeHandler);

		return () => {
			window.removeEventListener("resize", resizeHandler);
		};
	}, []);

	return (
		<>
			{phoneActive && (
				<button id="hamburger" onClick={() => setShowModal(true)}>
					<HiMenuAlt4 />
				</button>
			)}

			<aside
				style={
					phoneActive
						? {
							width: "20rem",
							height: "100vh",
							position: "fixed",
							top: 0,
							left: showModal ? "0" : "-20rem",
							transition: "all 0.5s",
						}
						: {}
				}
			>
				<h2>Logo.</h2>
				<DivOne location={location} />
				<DivTwo location={location} />
				<DivThree location={location} />

				{phoneActive && (
					<button id="close-sidebar" onClick={() => setShowModal(false)}>
						Close
					</button>
				)}
			</aside>
		</>
	);
};

const DivOne = ({ location }: { location: Location }) => {
	const [roboGeniusOpen, setRoboGeniusOpen] = useState(() => {
		// Initialize dropdown open state based on the current URL
		return location.pathname.includes("/admin/robo_genius");
	});

	useEffect(() => {
		// Keep dropdown open if the current path includes RoboGenius
		if (location.pathname.includes("/admin/robo_genius")) {
			setRoboGeniusOpen(true);
		}
	}, [location.pathname]);

	return (
		<div>
			<h5>Dashboard</h5>
			<ul>
				<Li url="/admin/myProfile" text="My Profile" Icon={FaUser} location={location} />
				<Li url="/admin/dashboard" text="Dashboard" Icon={RiDashboardFill} location={location} />
				<Li url="/admin/product" text="Product" Icon={RiShoppingBag3Fill} location={location} />
				<Li url="/admin/courses" text="Courses" Icon={SiCoursera} location={location} />
				<li
					style={{
						backgroundColor: location.pathname.includes("/admin/robo_genius")
							? "rgba(0,115,255,0.1)"
							: "white",
						padding: "0.5rem",
						borderRadius: "4px",
						marginBottom: "0.5rem",
					}}
				>
					<div
						onClick={() => setRoboGeniusOpen(!roboGeniusOpen)}
						style={{
							color: location.pathname.includes("/admin/robo_genius") ? "rgb(0,115,255)" : "black",
							cursor: "pointer",
							display: "flex",
							alignItems: "center",
							justifyContent: "space-between",
						}}
					>
						<span style={{ display: "flex", alignItems: "center" }}>
							<FaStar />
							<span style={{ marginLeft: "0.5rem" }}>RoboGenius</span>
						</span>
						{roboGeniusOpen ? <FaChevronDown /> : <FaChevronRight />}
					</div>
					{roboGeniusOpen && (
						<ul style={{ paddingLeft: "1rem", marginTop: "0.5rem" }}>
							<Li
								url="/admin/robo_genius"
								text="Add"
								Icon={AiFillFileText}
								location={location}
								isSubcategory
							/>
							<Li
								url="/admin/robo_genius"
								text="Update"
								Icon={AiFillFileText}
								location={location}
								isSubcategory
							/>
							<Li
								url="/admin/robo_genius"
								text="Delete"
								Icon={AiFillFileText}
								location={location}
								isSubcategory
							/>
						</ul>
					)}
				</li>
				<Li url="/admin/customer" text="Customer" Icon={IoIosPeople} location={location} />
				<Li url="/admin/users" text="Users" Icon={FaUsers} location={location} />
				<Li url="/admin/contact" text="Contact" Icon={MdContactMail} location={location} />
				<Li url="/admin/blogs" text="Blogs" Icon={FaBlog} location={location} />
				<Li url="/admin/Financial" text="Financial" Icon={FaMoneyBillWave} location={location} />





				<Li url="/admin/transaction" text="Transaction" Icon={AiFillFileText} location={location} />
			</ul>
		</div>
	);
};

const DivTwo = ({ location }: { location: Location }) => (
	<div>
		<h5>Charts</h5>
		<ul>
			<Li url="/admin/chart/bar" text="Bar" Icon={FaChartBar} location={location} />
			<Li url="/admin/chart/pie" text="Pie" Icon={FaChartPie} location={location} />
			<Li url="/admin/chart/line" text="Line" Icon={FaChartLine} location={location} />
		</ul>
	</div>
);

const DivThree = ({ location }: { location: Location }) => (
	<div>
		<h5>Apps</h5>
		<ul>
			<Li url="/admin/app/stopwatch" text="Stopwatch" Icon={FaStopwatch} location={location} />
			<Li url="/admin/app/coupon" text="Coupon" Icon={RiCoupon3Fill} location={location} />
			<Li url="/admin/app/toss" text="Toss" Icon={FaGamepad} location={location} />
		</ul>
	</div>
);

interface LiProps {
	url: string;
	text: string;
	location: Location;
	Icon: IconType;
}
const Li = ({ url, text, location, Icon, isSubcategory = false }: LiProps & { isSubcategory?: boolean }) => (
	<li
		style={{
			backgroundColor: location.pathname.includes(url) ? "rgba(0,115,255,0.1)" : "white",
			padding: isSubcategory ? "0.5rem" : "0.3rem",
			marginBottom: isSubcategory ? "0.3rem" : "0",
			borderRadius: isSubcategory ? "4px" : "0",
			border: isSubcategory ? "1px solid rgba(0,115,255,0.5)" : "none",
			cursor: "pointer",
		}}
		onClick={(e) => {
			e.stopPropagation(); // Prevents parent dropdown closure
		}}
	>
		<Link
			to={url}
			style={{
				color: location.pathname.includes(url) ? "rgb(0,115,255)" : "black",
				textDecoration: "none",
				display: "flex",
				alignItems: "center",
			}}
		>
			<Icon />
			<span style={{ marginLeft: "0.5rem" }}>{text}</span>
		</Link>
	</li>
);

export default AdminSidebar;
