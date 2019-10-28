import React, { Fragment } from 'react';
import {
	AsyncStorage,
	NetInfo,
	Alert,
	Image,
	ImageBackground,
	Platform,
	ScrollView,
	StyleSheet,
	Text,
	TouchableOpacity,
	TouchableWithoutFeedback,
	View,
	TouchableHighlight,
} from 'react-native';
import { Button as EleButton } from 'react-native-elements';
import Icon from "react-native-fontawesome-pro";
import moment from "moment";
import DatePicker from "react-native-datepicker";
import { DrawerActions } from 'react-navigation-drawer';
import { Menu, MenuOption, MenuOptions, MenuTrigger, renderers, } from 'react-native-popup-menu';
import Modal from "react-native-modal";
import _ from 'lodash';
import data from './../shared/TestDataForCalendar';
import GestureRecognizer from "react-native-swipe-gestures";
import { getBusinesses, getBusiness } from "../axios/api";
import { mapNumbersToDays } from "../shared/Utils";
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { getBusinessByAliases } from '../actions/GetBusinessByAliases';
import { getAllBusinesses } from '../actions/GetBusinessesAction';
import { deleteSingleAppointment } from '../actions/DeleteAppointmentAction';
import { defaultnullAppointment } from '../actions/CreateAppointmentAction';
import { deleteSingleBreak } from '../actions/DeleteBreakAction'
import { deleteSingleAvailableSlot } from '../actions/DeleteAvailableSlotAction'
import { defaultnullBlock } from '../actions/CreateBusyBlocksAction';
import { defaultnullSlot } from '../actions/CreateAvailabilitySlotsAction';
import { defaultnullBusiness } from '../actions/CreateBusinessAction';
import { removeFlag } from '../actions/BusinessCreationFalseAction';
import { ChannelConnection } from "../channel";
import LoadingAnimation from './../shared/LoadingAnimation';
import { RenderAvailEvents } from './CalenderFuncComponents';
import Swiper from 'react-native-swiper';
import { Item } from 'native-base';
const { Popover } = renderers;
//SNACKBAR
import SnackBarComponent from '../components/Snackbar';

// .add(7, "hours").add(31, "minutes")

class Screen extends React.Component {
	state = {
		isConnected: false,
		times: Array.from(Array(24), (_, i) => moment().startOf('day').add(i, "hours")),
		slots: {},
		slotsCopyState: {},
		rowHeight: 60,
		left: [],
		widths: [],
		loggedInUser: '',
		employees: {},
		minDuration: 30,
		isLoading: false,
		// date: moment("2019-10-19T08:52:31.663Z"),
		date: moment(),
		settings: [],
		multiSlotsActive: false,
		multipleAvailSlots: {},
		isMenuVisible: false,
		selectedMenuItem: "Day",
		employeesSelected: [],
		employeeModalVisible: false,
		activeRow: null,
		activeRowEmployee: null,
		longPressState: 'plus',
		business: {},
		atleastOne: true,
		customersListState: {},
		servicesListState: {},
		employeeList: {},
		data: [],
		counterFlag: 100,
		openHourMultipleDay: [

		],
		swiperIndexState: 1,
		indexname: 1,
		closingTopmargin: 0,
		openingHeight: 0,
		closingheight: 0,
		businessName: '',
		employees1: {},
		availabilitySlots: {},
		eventsListState: {},
		multipleSlots: {},
		avslotsMultiple: {},
		officehours: [],
		openingHoursState: {},
		DaysOfData: [
			{
				visibility: false,
				calDate: moment().subtract(1, "days"),
			},
			{
				visibility: true,
				calDate: moment(),
			},
			{
				visibility: false,
				calDate: moment().add(1, "days"),
			}
		]
	};

	static navigationOptions = ({ navigation }) => {
		return {
			title: 'Calendar',
			headerTitleStyle: {
				fontFamily: 'open-sans-hebrew',
				fontSize: 20,
				width: '100%',
				color: '#555555'
			},
			headerLeft: <View style={{
				flex: 1,
				width: '100%',
				marginLeft: 20,
				justifyContent: 'center',
				alignItems: 'flex-end',
			}}><Icon name="bars" type={"solid"} size={20} color={"#888888"} style={{ padding: 30 }}
				onPress={() => navigation.dispatch(DrawerActions.toggleDrawer())} /></View>,
			headerTitle: <View style={{
				flex: 1,
				flexDirection: 'row',
				justifyContent: 'space-between',
				alignItems: 'center',
				width: '100%'
			}}>
				<View style={{ flex: 2, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
					<Text onPress={() => this.datePickerRef.onPressDate()} style={{
						fontFamily: 'open-sans-hebrew',
						fontSize: 20,
						color: '#555555',
					}}>{navigation.getParam("date", moment()).format("MMM")}</Text>

					<Icon name="caret-down" type={"solid"} size={20} color={"#888888"}
						onPress={() => this.datePickerRef.onPressDate()} />

					<DatePicker
						style={{ width: 0, height: 0 }}
						date={navigation.getParam("date", moment())}
						mode="date"
						minDate={moment().format("YYYY-MM-DD")}
						minDate={moment().format("YYYY-MM-DD")}
						confirmBtnText="Confirm"
						cancelBtnText="Cancel"
						onDateChange={(date) => {
							navigation.getParam("handleDateChange")(date)
						}}
						showIcon={false}
						hideText={true}
						ref={(ref) => this.datePickerRef = ref}
					/></View>
				<View style={{ flex: 1 }}>
				</View>
				<TouchableOpacity style={{
					flex: 1,
					flexDirection: 'row',
					justifyContent: 'space-around',
					alignItems: 'center',
					width: '100%',
					// backgroundColor:'#ff0000'
				}}
					onPress={() => {
						navigation.getParam("handleEmployeeModal")();
						// console.log("wwww", navigation.getParam("employees"))
						// const test = Object.values(navigation.getParam("employees", {}));
						// console.log(test)
						// console.log("ss",test.filter(e=>e.isDone).length)
					}}
				>
					{/* <View style={{ width:10, height:10, backgroundColor:'#ff0000' }}></View> */}
					{Object.values(navigation.getParam("employees", {})).filter(e => e.isDone).map((e, i) => (i <= 2 ? <View key={e.user.id} style={[styles.smallCircle, {
						borderWidth: 1,
						borderColor: '#fff',
						borderRadius: 31 / 2
					}, e.user.image_id !== null ? {} : { backgroundColor: '#287F7E' }, i === 2 ? { backgroundColor: '#CCCCCC' } : {}]}>
						<View style={{
							flex: 1, justifyContent: 'center', alignItems: 'center', zIndex: i + 1
						}}>{i === 2 ? (
							<Text style={{
								fontFamily: 'open-sans-hebrew-bold',
								fontSize: 12,
								color: '#555555'
							}}>+{Object.values(navigation.getParam("employees")).filter(e => e.isDone).length - 2}</Text>
						) : (e.user.image_id ? <Image source={{ uri: e.user.image_id }}
							style={{
								width: 30,
								height: 30,
								borderRadius: 30 / 2,
								opacity: 0.7
							}}
							resizeMode={"cover"} /> : <Text style={{
								fontFamily: 'open-sans-hebrew',
								fontSize: 20,
								color: 'rgba(255,255,255,0.87)'
							}}>{e.user.first_name === null ? e.nickname.substring(0, 1) : e.user.first_name.substring(0, 1)}</Text>)}
						</View>
					</View> : null))}
					{/*<Text
                        onPress={() => navigation.getParam("handleEmployeeModal")()}>{navigation.getParam("employees", []).filter(e => e.selected).map(e => e.name).join(" ")}</Text>*/}
				</TouchableOpacity>
				<View style={{
					flex: 2, flexDirection: 'row',
					justifyContent: 'space-around',
					alignItems: 'center',
					width: '100%',
				}}>
					<Text style={{ fontSize: 10, fontFamily: 'open-sans-hebrew-bold', color: '#287F7E', paddingLeft: 5 }}>{navigation.getParam('name')}</Text>
				</View>
				<TouchableOpacity style={{ flex: 2, alignItems: 'flex-end', marginRight: 20 }}
					onPress={() => {
						navigation.getParam("handleDateChange")(moment())
					}}><Text style={{
						fontFamily: 'open-sans-hebrew-bold',
						fontSize: 13,
						color: '#287F7E',
					}}>{navigation.getParam("date", moment()).isSame(moment(), "day") ? '' : 'Today'}</Text></TouchableOpacity>
			</View>,
			/*
									headerTitle: navigation.state.params ? navigation.state.params.headerTitle : null,
			*/
			headerRight: <View style={{ flex: 1, width: '100%', marginRight: 20 }}>
				<Menu renderer={Popover}
					rendererProps={{ placement: 'bottom', anchorStyle: { flex: 0, width: 0, height: 15 } }}
					opened={navigation.getParam("isMenuVisible")}
					onBackdropPress={() => navigation.getParam("handleMenuChange")()}
					onSelect={() => navigation.getParam("handleMenuChange")()}
					backHandler={() => navigation.getParam("handleMenuChange")()}
				>
					<MenuTrigger
						customStyles={{ triggerOuterWrapper: { alignItems: 'center', justifyContent: 'flex-end' } }}
						hitSlop={{ top: 50, left: 50, bottom: 50, right: 50 }}
						pressRetentionOffset={{ top: 50, left: 50, bottom: 50, right: 50 }}
						onPress={() => navigation.getParam("handleMenuChange")()}>
						<TouchableOpacity onPress={() => navigation.getParam("handleMenuChange")()}
							style={{ flex: 1, justifyContent: 'center' }}>
							<View style={{ padding: 20 }}>
								<Icon name="ellipsis-v"
									hitSlop={{
										top: 50,
										left: 50,
										bottom: 50,
										right: 50,
									}}
									pressRetentionOffset={{
										top: 50,
										left: 50,
										bottom: 50,
										right: 50
									}} type={"regular"}
									size={20}
									color={"#888888"} />
							</View>
						</TouchableOpacity>
					</MenuTrigger>
					<MenuOptions style={{ height: 100, width: 130, paddingVertical: 5 }}>
						<MenuOption onSelect={() => navigation.getParam("handleMenuChange")('Day')}
							style={[navigation.getParam("menuOption") === 'Day' ? { backgroundColor: '#EEEEEE' } : {}]}>
							<Text style={{
								color: 'rgba(0,0,0,0.87)',
								marginLeft: 10,
								fontSize: 16,
								fontFamily: 'open-sans-hebrew'
							}}>Day</Text>
						</MenuOption>
						<MenuOption onSelect={() => navigation.getParam("handleMenuChange")('3 Days')}
							style={[navigation.getParam("menuOption") === '3 Days' ? { backgroundColor: '#EEEEEE' } : {}]}>
							<Text style={{
								color: 'rgba(0,0,0,0.87)',
								marginLeft: 10,
								fontSize: 16,
								fontFamily: 'open-sans-hebrew'
							}}>3 Days</Text>
						</MenuOption>
						<MenuOption onSelect={() => navigation.getParam("handleMenuChange")('5 Days')}
							style={[navigation.getParam("menuOption") === '5 Days' ? { backgroundColor: '#EEEEEE' } : {}]}>
							<Text style={{
								color: 'rgba(0,0,0,0.87)',
								marginLeft: 10,
								fontSize: 16,
								fontFamily: 'open-sans-hebrew'
							}}>5 Days</Text>
						</MenuOption>
					</MenuOptions>
				</Menu>
			</View>,
			drawerLockMode: 'locked-closed'
		}
	};
	//SNACKBAR
	DisplaySnackBar = (snackMessage) => {
		// this.props.navigation.setParams({ blur: false });
		this.refs.ReactNativeSnackBar.ShowSnackBarFunction(snackMessage);
	};

	toggleEmployeeModal = () => {
		this.setState((prevState => {
			return { ...prevState, employeeModalVisible: !prevState.employeeModalVisible }
		}));
	};

	toggleEmployeeSelected = (key) => {


		this.setState((prevState) => {

			let epllisttemp = prevState.employees;
			const selectedEmployees = Object.values(prevState.employees).map(selectedEmployee => {

				// TO CHANGE IT FROM TRUE TO FALSE OR REVERSE FOR SELECYED KEY
				if (selectedEmployee.user.id !== key) {
					return selectedEmployee;
				}
				else {
					let newSelectedEmployee = { ...selectedEmployee };
					newSelectedEmployee.selected = !selectedEmployee.selected;
					return newSelectedEmployee;
				}

			});

			// TO CONVERT TO OBJECT LIST AGAIN  HAVING KEY AND CORESPONDING VALUE ( WITHOUT THIS NOT POSSIBLE  )
			const selectEmplObjlist = {};
			selectedEmployees.map((emp, empindex) => {
				selectEmplObjlist[selectedEmployees[empindex].user.id] = selectedEmployees[empindex];
			})


			// console.log("SELECTED EMPLOYESS", selectedEmployees, selectEmplObjlist, this.state.employees[key].nickname)
			// console.log("CONVERTED AND SELECTED ARR", selectEmplObjlist)
			// return { ...prevState, employees: selectEmplObjlist, atleastOne: false }
			// this.props.navigation.setParams({ employees: selectEmplObjlist });

			if (prevState.selectedMenuItem === "Day") {
				if (Object.values(selectEmplObjlist).reduce((acc, cv) => acc += cv.selected ? 1 : 0, 0) > 5) {
					Alert.alert("Info", "Max 5 employees selected");
					return { ...prevState, atleastOne: true };
				} else {

					let count = Object.values(selectEmplObjlist).reduce((acc, cv) => acc += cv.selected ? 1 : 0, 0);
					// console.log(count)
					if (count === 0) {

						const newSelectedEmp = {}

						Object.values(selectEmplObjlist).map((e) => {
							newSelectedEmp[e.user.id] = e
							newSelectedEmp[e.user.id].selected = false
						})


						return { ...prevState, employees: newSelectedEmp, atleastOne: false }
					}
					else
						if ((prevState.selectedMenuItem === '3 Days' || prevState.selectedMenuItem === '5 Days') && Object.values(selectEmplObjlist).reduce((acc, cv) => acc += cv.selected ? 1 : 0, 0) > 1) {
							this.props.navigation.setParams({ employees: selectEmplObjlist });
							this.props.navigation.setParams({ menuOption: 'Day' });
							return {
								...prevState,
								employees: selectEmplObjlist,
								selectedMenuItem: 'Day',
								slots: data.slots,
								atleastOne: true
							};
						} else {
							this.props.navigation.setParams({ employees: selectEmplObjlist });
							return {
								...prevState,
								employees: selectEmplObjlist,
								atleastOne: true
							};
						}
					// return { ...prevState, employees: selectEmplObjlist, atleastOne: true }
				}
			}
			else {
				if (Object.values(selectEmplObjlist).reduce((acc, cv) => acc += cv.selected ? 1 : 0, 0) > 1) {
					Alert.alert("Info", "Max 1 employee can be  selected for Multiple Day View");
					return { ...prevState, atleastOne: true };
				} else {

					let count = Object.values(selectEmplObjlist).reduce((acc, cv) => acc += cv.selected ? 1 : 0, 0);
					// console.log(count)
					if (count === 0) {

						const newSelectedEmp = {}

						Object.values(selectEmplObjlist).map((e) => {
							newSelectedEmp[e.user.id] = e
							newSelectedEmp[e.user.id].selected = false
						})


						return { ...prevState, employees: newSelectedEmp, atleastOne: false }
					}
					else
						if ((prevState.selectedMenuItem === '3 Days' || prevState.selectedMenuItem === '5 Days') && Object.values(selectEmplObjlist).reduce((acc, cv) => acc += cv.selected ? 1 : 0, 0) > 1) {
							this.props.navigation.setParams({ employees: selectEmplObjlist });
							this.props.navigation.setParams({ menuOption: 'Day' });
							return {
								...prevState,
								employees: selectEmplObjlist,
								selectedMenuItem: 'Day',
								slots: data.slots,
								atleastOne: true
							};
						} else {
							this.props.navigation.setParams({ employees: selectEmplObjlist });
							return {
								...prevState,
								employees: selectEmplObjlist,
								atleastOne: true
							};
						}
					// return { ...prevState, employees: selectEmplObjlist, atleastOne: true }
				}
			}

			//     let count = Object.values(selectEmplObjlist).reduce((acc, cv) => acc += cv.selected ? 1 : 0, 0);
			//     console.log(count)
			//     if (count === 0) {

			//         for (var key in selectEmplObjlist) {
			//             selectEmplObjlist[key].selected = false;
			//         }
			//         return { ...prevState, employees: selectEmplObjlist, atleastOne: false }
			//     }
			//     else {
			//         /*
			//         * Check if currently in 3 Days or 5 Days view
			//         * Switch to Day view if new selected is greater than 1
			//         * */
			//         return {
			//             ...prevState,
			//             employees: selectEmplObjlist,
			//             atleastOne: true
			//         };
			//     }
			// }


		});


	};


	toggleWithBackDrop = () => {
		this.toggleEmployeeModal();
		this.setState(prevState => {
			const selectedEmp = {}

			Object.values(prevState.employees).map((emp, i) => {
				selectedEmp[emp.user.id] = emp;
				if (i === 0) {
					selectedEmp[emp.user.id].selected = true;
					selectedEmp[emp.user.id].isDone = true;
				}
				if (selectedEmp[emp.user.id].isDone == true) { selectedEmp[emp.user.id].selected = true }
				else selectedEmp[emp.user.id].selected = false
			})


			return {
				...prevState, employees: selectedEmp, atleastOne: true
			}
		})
	}

	getSelectedCount = () => Object.values(this.state.employees).reduce((acc, cv) => acc += cv.selected ? 1 : 0, 0);

	getSelectedCountWithDone = () => Object.values(this.state.employees).reduce((acc, cv) => acc += cv.isDone ? 1 : 0, 0);

	findOverlaps = (slot, j, accessor) => {
		let array = this.state.slots[accessor].reduce((acc, cv, ci) => {
			//console.log("slots start time", cv.startTime)
			let endTime = cv.startTime.clone().add(cv.duration, "minutes");
			let slotEndTime = slot.startTime.clone().add(slot.duration, "minutes");
			if (slot.startTime.isBetween(cv.startTime, endTime, "minutes", '()') && ci !== j) {
				if (acc.findIndex(e => e.key === cv.key) === -1)
					acc.push(cv);
			}
			if (slotEndTime.isBetween(cv.startTime, endTime, "minutes", '()') && ci !== j) {
				if (acc.findIndex(e => e.key === cv.key) === -1)
					acc.push(cv);
			}

			if (slot.startTime.isSame(cv.startTime, "minutes") && slotEndTime.isSame(endTime, "minutes")) {
				if (acc.findIndex(e => e.key === cv.key) === -1)
					acc.push(cv);
			}

			if (slot.startTime.isSame(cv.startTime, "minutes") && endTime.isBefore(slotEndTime, "minutes")) {
				if (acc.findIndex(e => e.key === cv.key) === -1)
					acc.push(cv);
			}

			if (slotEndTime.isSame(endTime, "minutes") && cv.startTime.isAfter(slot.startTime, "minutes")) {
				if (acc.findIndex(e => e.key === cv.key) === -1)
					acc.push(cv);
			}

			return acc;
		}, [slot]);
		array = array.sort((a, b) => {
			if (moment(a.startTime).diff(moment(b.startTime), "minutes") === 0) {
				/*
				* For same times key will decide
				* */
				return a.key - b.key;
			}
			return moment(a.startTime).diff(moment(b.startTime), "minutes")
		});
		return array;
	};

	calculateLefts = (slot, j, accessor) => {
		let array = this.findOverlaps(slot, j, accessor);
		if (array.length === 1)
			return '0%';
		else {
			let index = array.findIndex(e => e.key === this.state.slots[accessor][j].key);
			// console.log("LEFTS   %   ", index * (100 / array.length) + "%")
			return index * (100 / array.length) + "%";
		}
	};

	calculateWidths = (slot, j, accessor) => {
		let array = this.findOverlaps(slot, j, accessor);
		if (array.length === 1)
			return '100%';
		else {
			let index = array.findIndex(e => e.key === this.state.slots[accessor][j].key);
			// console.log("WIDTH %  ", 100 / array.length + "%")
			return 100 / array.length + "%";
		}
	};


	counter = false;
	counterForFlag = true;

	async updateEmpList(empList, reqtype) {
		// console.warn("emplist", empList)

		newemploylist = {}

		if (reqtype === undefined) {
			if (Object.keys(empList).length > 0) {

				await Object.values(empList).map((employee, index) => {
					newemploylist[employee.user.id] = employee;
					newemploylist[employee.user.id].selected = false;
					newemploylist[employee.user.id].isDone = false;
				})

				if (newemploylist[this.state.loggedInUser] !== undefined) {
					console.log("FOUND LOGGED IN USER")
					newemploylist[this.state.loggedInUser].isDone = true;
					newemploylist[this.state.loggedInUser].selected = true;
				} else {
					console.log("NOT FOUND LOGGED IN USER ")
					newemploylist[Object.keys(newemploylist)[0]].isDone = true;
					newemploylist[Object.keys(newemploylist)[0]].selected = true;
				}

			}
		}
		else {
			var result = ""
			if (Object.keys(empList).length > 0) {

				await Object.values(empList).map((employee, index) => {
					newemploylist[employee.user.id] = employee;


					if (result === "" && newemploylist[employee.user.id].isDone === true) {
						result = employee.user.id;
					}
					else {
						newemploylist[employee.user.id].selected = false;
						newemploylist[employee.user.id].isDone = false;
					}
				})


			}
		}


		await this.setState({
			employees: newemploylist
		})

		this.props.navigation.setParams({ employees: this.state.employees });
		console.log("SHOWE YPDATEED LIST", Object.keys(empList).length)
		console.log("SHOWE YPDATEED LIST", this.state.employees)

	}

	//DELETE APPOI
	deleteAppointmentId = (appointment_id) => {
		console.log("APTBUSYNAME", this.state.businessName)
		console.log("APT_ID", appointment_id)
		this.props.deleteSingleAppointment(this.state.businessName, appointment_id)
	}
	//DELETE BREAK
	deleteBreakId = (busy_block_id) => {
		console.log("busynameNAME", this.state.businessName)
		console.log("breakidcalende", busy_block_id)
		this.props.deleteSingleBreak(this.state.businessName, busy_block_id)
	}

	//DELETE AVAILABLE SLOT
	deleteAvaialbleSlotId = (availability_slot_id) => {
		console.log("busynameNAME", this.state.businessName)
		console.log("breakidcalende", availability_slot_id)
		this.props.deleteSingleAvailableSlot(this.state.businessName, availability_slot_id)
	}



	async componentWillReceiveProps(nextProps, prevProps) {
		//SNACKBAR Business
		if (nextProps.pendingBusiness === false) {
			this.DisplaySnackBar("Business Created Successfully")
		} else if (nextProps.createBError === true) {
			this.DisplaySnackBar("Error While Creating Business ")
		}
		this.props.defaultnullBusiness();

		//SNACKBAR Appointment
		if (nextProps.pendingAppointment === false) {
			this.DisplaySnackBar("Appointment Created Successfully")
		} else if (nextProps.createAppError === true) {
			this.DisplaySnackBar("Error While Creating Appointment")
		}
		else if (nextProps.deleteAptError === false) {
			this.DisplaySnackBar("Appointment Deleted Successfully")
		}
		this.props.defaultnullAppointment();

		//SNACKBAR Break
		if (nextProps.pendingBusyBlock === false) {
			this.DisplaySnackBar("Break Created Successfully")
		} else if (nextProps.createBlockError === true) {
			this.DisplaySnackBar("Error While Creating Break")
		}
		else if (nextProps.deleteBlockError === false) {
			this.DisplaySnackBar("Break Deleted Successfully")
		}
		this.props.defaultnullBlock();


		//SNACKBAR SLOt
		if (nextProps.pendingAvailabilitySlot === false) {
			this.DisplaySnackBar("Slot Created Successfully")
		} else if (nextProps.createASError === true) {
			this.DisplaySnackBar("Error While Creating Slot")
		}
		else if (nextProps.deleteAvailableSlotError === false) {
			this.DisplaySnackBar("Available Slot Deleted Successfully")
		}
		this.props.defaultnullSlot();


		console.log("============================================\n==================================================")
		// console.log("Component Will Receive Props", nextProps.employees)
		const businessName = await AsyncStorage.getItem('businessName');


		// console.log("This is your Eventlist");
		// nextProps.events.map((item, index) => {
		//     console.log(item.start.dateTime + " " + item.end.dateTime + " " + item.summary + " " + item.extendedProperties.shared.type + " " + item.extendedProperties.shared.for_employees + " " + item.extendedProperties.shared.employee_id)
		// });
		// console.log("This is your employees", nextProps.employees)
		// // console.log("This is your customers", nextProps.customers)
		// // console.log("This is your services", nextProps.services)
		// console.log("This is your opening Hours", nextProps.openingHours)
		// nextProps.events.map(item => {
		//     console.log("event time", item.startTime)
		// })


		// RASIKA CODE

		if (Object.keys(nextProps.businesses).length > 0) {


			var newbusinessObj = null;
			Object.values(nextProps.businesses).map((item, i) => {
				// console.warn("NEW BUSINESS LOOP START")
				if (item.newlyCreated === true) {
					// console.warn("NEW BUSINESS IF")
					newbusinessObj = item
				}
				else {
					// console.warn("NEW BUSINESS ELSE")
					newbusinessObj = null
				}
			})
			if (Object.keys(nextProps.businesses).newlyCreated === true) {
				// console.warn(" NEW BUSINESS newlyCreated")
			}
			// console.warn(" NEW BUSINESS newly created", newbusinessObj)

			if (newbusinessObj != null) {
				// console.warn("INSIDE CONDITION")
				const firstBusinessName = newbusinessObj.aliases;
				const firstBusiness_Id = newbusinessObj.id;
				await AsyncStorage.setItem("businessName", firstBusinessName[0])
				await AsyncStorage.setItem("business_id", firstBusiness_Id);
				this.setState({ businessName: firstBusinessName[0] })
				obj = new ChannelConnection();
				obj.connectChannel('business');
				console.log("receivesprops 6")
				// this.counterForFlag = true;
				if (this.counterForFlag === true) {
					this.counterForFlag = false
					this.props.getBusinessByAliases(firstBusinessName[0]);

				}
				this.counterForFlag = true
				this.props.removeFlag(newbusinessObj);

			} else {
				if (businessName === null) {
					//no business open previously
					const firstBusinessName = nextProps.businesses[Object.keys(nextProps.businesses)[0]].aliases;
					const firstBusiness_Id = nextProps.businesses[Object.keys(nextProps.businesses)[0]].id;
					await AsyncStorage.setItem("businessName", firstBusinessName[0])
					await AsyncStorage.setItem("business_id", firstBusiness_Id);
					// console.log("Business Name 1", firstBusinessName[0])
					this.setState({ businessName: firstBusinessName[0] })
					obj = new ChannelConnection();
					obj.connectChannel('business');
					// console.log("receivesprops 2")
					this.props.getBusinessByAliases(firstBusinessName[0]);
				}
				else if (nextProps.navigation.state.params['business_id']) {
					if (nextProps.navigation.state.params.aliases[0] != this.state.businessName) {
						const businessName = nextProps.navigation.state.params['aliases'];
						const business_id = nextProps.navigation.state.params['business_id']
						console.log("bb", businessName[0])
						await AsyncStorage.setItem('businessName', businessName[0]);
						await AsyncStorage.setItem("business_id", business_id)
						obj = new ChannelConnection();
						obj.connectChannel('business');
						this.setState({ businessName: businessName });
						// console.log("receivesprops 3")
						this.props.getBusinessByAliases(businessName);
					} else {
						// console.log("receivesprops 4")
					}
				} else {
					if (this.counter === false) {
						console.log("receivesprops 5", businessName, this.state.businessName)
						obj = new ChannelConnection();
						obj.connectChannel('business');
						//this.updateEmpList(ne)
						this.counter = true
					}
					else {
						// console.log("else cond")
					}
				}
			}

		} else {
			console.log("no data")
		}




		// 
		this.setState({ customersListState: nextProps.customers })
		this.setState({ servicesListState: nextProps.services })
		// this.props.navigation.setParams({ name: nextProps.name })
		// this.setState({ name: nextProps.name })

		// PROBLEM SOLVED
		if (this.state.bName !== nextProps.name) {

			this.updateEmpList(nextProps.employees)
			this.props.navigation.setParams({ name: nextProps.name })
			this.setState({ bName: nextProps.name })

		}

		let newemploylist = {}

		// console.warn("prevProps", prevProps)
		//  IF THE NESTPROPS ARE DIFF THAN STATE

		if (this.getSelectedCountWithDone() === 0) {
			await this.updateEmpList(nextProps.employees)
		}

		// console.warn("LENGTH", Object.keys(nextProps.employees).length, Object.keys(this.state.employees).length,
		//     "===========================================", nextProps.employees, this.state.employees)
		if (Object.keys(nextProps.employees).length !== Object.keys(this.state.employees).length) {

			// console.log("inside check length")
			this.updateEmpList(nextProps.employees)

		}


		let officehours = [];
		// console.log("OFFICE HOURS 2", this.state.officehours, nextProps.openingHours, this.state.openingHoursState)
		if (Object.values(nextProps.openingHours).length === 0) {

			// console.log("{} timing")
		} else {

			if (nextProps.openingHours === this.state.openingHoursState) {
				// console.log("same timing")
			}
			else {
				await this.setState({ openingHoursState: nextProps.openingHours })
				officehours = await mapNumbersToDays(nextProps.openingHours);
				// const timesArray = await this.calculateTimes(this.state.date, settings);
				await this.setState({
					officehours: officehours,
					// times: timesArray
				})

				await this.setState({ openingHeight: this.getHeight(this.state.date), closingheight: this.getclosingheight(this.state.date), closingTopmargin: this.getTopmargin(this.state.date) })
				// console.warn("OPENING HEIGHT", this.state.openingHeight, "CLOSING HEIGHT", this.state.closingheight, "TOP MARGON", this.state.closingTopmargin);
				// console.warn("OFFICE HOURS", this.state.officehours[moment(this.state.date).format("dddd")])
			}

		}





		if (Object.keys(nextProps.events).length === Object.keys(this.state.eventsListState).length) {
			// console.log("SAME EVENT LIST", Object.keys(nextProps.events).length, Object.keys(this.state.eventsListState).length)
		}
		else {
			// console.log("DIFFERENT EVENT LIST", Object.keys(nextProps.events).length, Object.keys(this.state.eventsListState).length);
			await this.setState({ eventsListState: nextProps.events })

			// console.warn("EVENT LIST", this.state.eventsListState)

			if (this.state.selectedMenuItem === "Day") {
				this.extractEventofDay(this.state.date, this.state.eventsListState, this.state.employees)
			}
			else {
				this.getMultipleSlots(this.state.employees);
			}
		}

	}



	async get5dayShift(date, eventlist, empid) {

		var resultObj = {}, ctr = 0, multipleAvailSlots = {}, avctr = 0;
		// resultObj[]
		resultObj[moment(date).format("YYYY-MM-DD")] = [];
		resultObj[moment(date).add(1, "days").format("YYYY-MM-DD")] = [];
		resultObj[moment(date).add(2, "days").format("YYYY-MM-DD")] = [];
		resultObj[moment(date).add(3, "days").format("YYYY-MM-DD")] = [];
		resultObj[moment(date).add(4, "days").format("YYYY-MM-DD")] = [];


		multipleAvailSlots[moment(date).format("YYYY-MM-DD")] = [];
		multipleAvailSlots[moment(date).add(1, "days").format("YYYY-MM-DD")] = [];
		multipleAvailSlots[moment(date).add(2, "days").format("YYYY-MM-DD")] = [];
		multipleAvailSlots[moment(date).add(3, "days").format("YYYY-MM-DD")] = [];
		multipleAvailSlots[moment(date).add(4, "days").format("YYYY-MM-DD")] = [];




		var emplyList = [], dateNumber = moment();

		eventlist.map((event, eventNumber) => {

			// console.log("ASYN C5 DAYS", moment(date).format())
			// console.log("CURRENT DATE", date, "key", ctr, "SUMMARY", event.summary, "starttimefor this", moment(event.start.dateTime), moment(event.end.dateTime), event.extendedProperties.shared.type, event.extendedProperties.shared.for_employees, event.extendedProperties.shared.employee_id);
			dateNumber = moment(event.start.dateTime).format("YYYY-MM-DD") === moment(date).format("YYYY-MM-DD") ? (moment(date).format("YYYY-MM-DD")) :
				(moment(event.start.dateTime).format("YYYY-MM-DD") === moment(date).add(1, "days").format("YYYY-MM-DD") ? (moment(date).add(1, "days").format("YYYY-MM-DD")) :
					(moment(event.start.dateTime).format("YYYY-MM-DD") === moment(date).add(2, "days").format("YYYY-MM-DD") ? moment(date).add(2, "days").format("YYYY-MM-DD") :
						(moment(event.start.dateTime).format("YYYY-MM-DD") === moment(date).add(3, "days").format("YYYY-MM-DD") ? moment(date).add(3, "days").format("YYYY-MM-DD") :
							(moment(event.start.dateTime).format("YYYY-MM-DD") === moment(date).add(4, "days").format("YYYY-MM-DD") ? moment(date).add(4, "days").format("YYYY-MM-DD") : null))));


			// console.log("STARTTIME ANOTHER", dateNumber, event.start, event.end)

			if (dateNumber !== null) {
				if (event.extendedProperties.shared.type === 'appointment') {

					if (event.extendedProperties.shared.employee_id === empid) {
						console.log("KEY", ctr)
						resultObj[dateNumber].push({
							key: ctr,
							startTime: moment(event.start.dateTime).utc(),
							"endTime": moment(event.end.dateTime).utc(),
							serviceColor: this.state.servicesListState[event.extendedProperties.shared.service_id].settings.color,
							customer: this.getValidText(this.state.customersListState[event.extendedProperties.shared.customer_id].user.first_name, this.state.customersListState[event.extendedProperties.shared.customer_id].nickname),
							duration: this.getDuration(event.start.dateTime, event.end.dateTime),
							"slotid": event.id,
							"serviceid": event.extendedProperties.shared.service_id,
							"employeeids": event.extendedProperties.shared.employee_id,
							"customerid": event.extendedProperties.shared.customer_id,
							"eventType": event.extendedProperties.shared.type,
						});
						ctr = ctr + 1;
					}
				}

				else if (event.extendedProperties.shared.type === 'busy-block') {


					emplyList = event.extendedProperties.shared.for_employees.split(",");
					emplyList.map((item, index) => {

						if (item === empid) {

							resultObj[dateNumber].push({
								"key": ctr,
								"type": "break",
								"startTime": moment(event.start.dateTime).utc(),
								"endTime": moment(event.end.dateTime).utc(),
								"serviceColor": "#287F7E",
								"customer": event.summary,
								"duration": this.getDuration(event.start.dateTime, event.end.dateTime),
								"slotid": event.id,
								"employeeids": event.extendedProperties.shared.for_employees,
								"eventType": event.extendedProperties.shared.type,

							});
							ctr = ctr + 1
						}

					});



				}
				else {


					emplyList = event.extendedProperties.shared.for_employees.split(",");
					emplyList.map((item, index) => {

						if (item === empid) {

							multipleAvailSlots[dateNumber].push({
								"key": avctr,
								// "type": "break",
								"startTime": moment(event.start.dateTime).utc(),
								"endTime": moment(event.end.dateTime).utc(),
								// "serviceColor": "#287F7E",
								"customer": event.summary,
								"duration": this.getDuration(event.start.dateTime, event.end.dateTime),
								"slotid": event.id,
								"employeeids": event.extendedProperties.shared.for_employees,
								"eventType": event.extendedProperties.shared.type,

							});
							avctr = avctr + 1
						}

					});



				}
			}


		});


		console.log("MULTIPLE AVAIL SLOTS", multipleAvailSlots);

		// console.log("ASYN C5 DAYS", moment(date).format(), "RESULT OBJ")
		// console.warn("AVAILABLE SOTS", resultObj)
		this.setState({ multipleSlots: resultObj, slots: resultObj, multipleAvailSlots: multipleAvailSlots, availabilitySlots: multipleAvailSlots })
		// console.log("ASYN C5 DAYS STTAE", this.state.slots);
	}

	getOpHoursMultiple = async () => {

		var openingMultiple = [];

		for (var i = 0; i < 5; i++) {

			newObj = {
				openheight: this.getHeight(moment(this.state.date).add(i, "days").format("YYYY-MM-DD")),
				closeheight: this.getclosingheight(moment(this.state.date).add(i, "days").format("YYYY-MM-DD")),
				topMargin: this.getTopmargin(moment(this.state.date).add(i, "days").format("YYYY-MM-DD"))
			}

			// console.warn("NEW OBJ", newObj)
			await openingMultiple.push(newObj)
		}

		// console.warn("NEW OBJ", openingMultiple)
		// this.getHeight(this.state.date), 
		// this.getclosingheight(this.state.date),
		// this.getTopmargin(this.state.date)
		return openingMultiple;
	}

	async componentDidMount() {

		NetInfo.isConnected.addEventListener(
			'connectionChange',
			this._handleConnectivityChange
		);
		NetInfo.isConnected.fetch().done(
			(isConnected) => { this.setState({ isConnected }); }
		);
		// console.warn("Employeedata Structure", Object.values(data.employees))
		// console.warn("Component Did Mount", this.props.employees);
		var userSessionData = await AsyncStorage.multiGet(['session']);
		var sessionData = JSON.parse(userSessionData[0][1]);

		this.setState({ loggedInUser: sessionData.user_id })
		//console.warn("inside function => user id", (sessionData.user_id), this.state.loggedInUser)


		// console.warn(this.state.date);

		const businessName = await AsyncStorage.getItem('businessName');
		const business_id = await AsyncStorage.getItem('business_id');
		//console.log("aa", businessName, business_id)
		// console.log("slotssssssss", this.state.slots)
		// console.log("Slots design sample", data.slots["0053636b-828b-4d6e-bb64-52d4dbdf853f"][0].startTime)
		// console.log("TODAYS DATE", this.state.date)
		if (businessName != undefined) {
			this.setState({ businessName: businessName });
			// console.log("receivesprops 1")
			this.props.getBusinessByAliases(businessName);
		}
		else {
			// console.log("1st login")
			this.props.getAllBusinesses();
		}
		// console.log("this.state.employees", this.state.employees)
		// const settings = await mapNumbersToDays(this.state.openingHoursState);
		// console.log('This is settings', settings);
		// const timesArray = await this.calculateTimes(this.state.date, settings);

		console.log("COMPONENT DID MOUNT", this.state.date)

		const navigationConst = this.props.navigation;

		var newEmployees = await navigationConst.getParam("newEmployees", "");
		console.log("NEW EMPLOYESSS #$#$", newEmployees)

		// this.setState({
		//     // business: response.data.businesses[0],
		//     settings: settings,
		// });
		this.props.navigation.setParams({ handleDateChange: this.onDateChange });
		this.props.navigation.setParams({ handleMenuChange: this.onMenuChange });
		this.props.navigation.setParams({ date: moment() });
		this.props.navigation.setParams({ isMenuVisible: this.state.isMenuVisible });
		this.props.navigation.setParams({ menuOption: this.state.selectedMenuItem });
		this.props.navigation.setParams({ handleEmployeeModal: this.toggleEmployeeModal });
		// this.props.navigation.setParams({ employees: this.state.employees });
		// console.log("NEW CHECK NAAH", this.props.navigation.getParam(("employees"))=== null?"true":"false");
	}

	componentWillUnmount() {
		NetInfo.isConnected.removeEventListener(
			'connectionChange',
			this._handleConnectivityChange
		);
	}


	_handleConnectivityChange = (isConnected) => {
		this.setState({
			isConnected,
		});
	};


	onDateChange = async (date) => {
		// console.log("this is theondatechanbge methidf", this.state.settings)
		// console.log("ON CHANGE DATE", date, this.state.settings)

		// const timesArray = await this.calculateTimes(date, this.state.settings);
		// console.log("ON DATE CHANGE- NEW DATE", date, "SECLEDTED INDEX IS", this.state.selectedMenuItem)
		// swiperIndexState
		console.warn("THIS IS THE SWIPER INDEX", this.state.swiperIndexState)

		// await this.setState({ openingHeight: this.getHeight(date), closingheight: this.getclosingheight(date), closingTopmargin: this.getTopmargin(date) })
		// console.warn("DONE")

		// if (this.state.selectedMenuItem === 'Day') {
		// 	this.props.navigation.setParams({ date: moment(date) });
		// 	console.log("INTO DAY SECTION-")
		// 	await this.setState({ date: date, });
		// 	this.extractEventofDay(date, this.state.eventsListState, this.state.employees)

		// }
		// else {
		// 	this.props.navigation.setParams({ date: moment(date) });
		// 	console.log("INTO 3-5 DAY VIEW SECTION-")
		// 	await this.setState({ date: date, });
		// 	await this.getMultipleSlots(this.state.employees)
		// 	// await this.setState({ slots: this.state.multipleSlots });
		// }

	};

	getDuration(startTime, endTime) {

		START = moment(startTime).format('HH.mm');
		END = moment(endTime).format('HH.mm');
		var timeDiff = moment.utc(moment(END, " HH:mm").diff(moment(START, " HH:mm"))).format("HH:mm");
		const diffDuration = moment.duration(timeDiff);
		var hrs = diffDuration.hours();
		var min = diffDuration.minutes();
		var convertIntoMin = hrs * 60;
		var totalMin = parseInt(convertIntoMin) + parseInt(min);
		return totalMin;
	}

	async extractEventofDay(date, eventlist, employlist) {
		// console.log("extractedEventofday")
		console.warn("SWIPERINDEX STATWE", this.state.swiperIndexState)
		// console.log("cehcking eventofDay", moment(date), eventlist, employlist)

		var slotsObj = {}, avslots = {};


		var ctr = 1, avctr = 1;




		eventlist.map((item, index) => {


			var emplyList = [];

			// console.log("CURRENT DATE", date, "key", ctr);
			// console.log("check date format", moment(date).format("YYYY/MM/DD"), moment(item.start.dateTime).format("YYYY/MM/DD"))
			if (moment(date).format("YYYY/MM/DD") === moment(item.start.dateTime).format("YYYY/MM/DD")) {
				// console.log("same date")
				if (eventlist[index].extendedProperties.shared.type === 'appointment') {
					// console.warn('appointment', responseD[index].extendedProperties.shared.employee_id)
					if (slotsObj[eventlist[index].extendedProperties.shared.employee_id] === undefined) {
						slotsObj[eventlist[index].extendedProperties.shared.employee_id] = [{
							"key": ctr, "serviceColor": this.state.servicesListState[eventlist[index].extendedProperties.shared.service_id].settings.color,
							"customer": this.getValidText(this.state.customersListState[eventlist[index].extendedProperties.shared.customer_id].user.first_name, this.state.customersListState[eventlist[index].extendedProperties.shared.customer_id].nickname),
							"startTime": moment(eventlist[index].start.dateTime).utc(),
							"endTime": moment(eventlist[index].end.dateTime).utc(),
							"duration": this.getDuration(eventlist[index].start.dateTime, eventlist[index].end.dateTime),
							"slotid": eventlist[index].id,
							"serviceid": eventlist[index].extendedProperties.shared.service_id,
							"employeeids": eventlist[index].extendedProperties.shared.employee_id,
							"customerid": eventlist[index].extendedProperties.shared.customer_id,
							"eventType": eventlist[index].extendedProperties.shared.type,
						}];
					}
					else {
						// console.warn(slotsObj[responseD[index].extendedProperties.shared.employee_id])
						slotsObj[eventlist[index].extendedProperties.shared.employee_id].push({
							"key": ctr, "serviceColor": this.state.servicesListState[eventlist[index].extendedProperties.shared.service_id].settings.color,
							"customer": this.getValidText(this.state.customersListState[eventlist[index].extendedProperties.shared.customer_id].user.first_name, this.state.customersListState[eventlist[index].extendedProperties.shared.customer_id].nickname),
							"startTime": moment(eventlist[index].start.dateTime).utc(), "endTime": moment(eventlist[index].end.dateTime).utc(), "duration": this.getDuration(eventlist[index].start.dateTime, eventlist[index].end.dateTime),
							"slotid": eventlist[index].id,
							"serviceid": eventlist[index].extendedProperties.shared.service_id,
							"employeeids": eventlist[index].extendedProperties.shared.employee_id,
							"customerid": eventlist[index].extendedProperties.shared.customer_id,
							"eventType": eventlist[index].extendedProperties.shared.type,
						})
						// Object.assign(slotsObj[responseD[index].extendedProperties.shared.employee_id], { [ctr]: { serviceid: responseD[index].extendedProperties.shared.service_id } })
					}
					ctr = ctr + 1;
				}

				else if (eventlist[index].extendedProperties.shared.type === 'busy-block') {
					//console.warn('busy-block', responseD[index].extendedProperties.shared.for_employees)

					emplyList = eventlist[index].extendedProperties.shared.for_employees.split(",")
					emplyList.map((innerItem, innerIndex) => {
						if (slotsObj[innerItem] === undefined) {
							// slotsObj[item] = { [ctr]: { businessid: responseD[index].extendedProperties.shared.business_id } }
							slotsObj[innerItem] = [{
								"key": ctr, "customer": eventlist[index].summary,
								"type": "break", "serviceColor": "#287F7E",
								"startTime": moment(eventlist[index].start.dateTime).utc(),
								"endTime": moment(eventlist[index].end.dateTime).utc(),
								"duration": this.getDuration(eventlist[index].start.dateTime, eventlist[index].end.dateTime),
								"slotid": eventlist[index].id,
								"employeeids": eventlist[index].extendedProperties.shared.for_employees,
								"eventType": eventlist[index].extendedProperties.shared.type,
							}]
						}
						else {
							slotsObj[innerItem].push({
								"key": ctr, "customer": eventlist[index].summary,
								type: "break", serviceColor: "#287F7E",
								"startTime": moment(eventlist[index].start.dateTime).utc(),
								"endTime": moment(eventlist[index].end.dateTime).utc(),
								"slotid": eventlist[index].id,
								"employeeids": eventlist[index].extendedProperties.shared.for_employees,
								"eventType": eventlist[index].extendedProperties.shared.type,
								"duration": this.getDuration(eventlist[index].start.dateTime, eventlist[index].end.dateTime)
							})

							// Object.assign(slotsObj[item], { [ctr]: asd })
						}

						ctr = ctr + 1
					})

				}
				else {
					// console.warn('availability-slot', responseD[index].extendedProperties.shared.for_employees)
					emplyList = eventlist[index].extendedProperties.shared.for_employees.split(",")
					emplyList.map((innerItem, innerIndex) => {
						if (avslots[innerItem] === undefined) {
							// slotsObj[item] = { [ctr]: { businessid: responseD[index].extendedProperties.shared.business_id } }
							avslots[innerItem] = [{
								"key": avctr,
								"customer": eventlist[index].summary,
								"startTime": moment(eventlist[index].start.dateTime).utc(),
								"endTime": moment(eventlist[index].end.dateTime).utc(),
								"duration": this.getDuration(eventlist[index].start.dateTime, eventlist[index].end.dateTime),
								"slotid": eventlist[index].id,
								"employeeids": eventlist[index].extendedProperties.shared.for_employees,
								"eventType": eventlist[index].extendedProperties.shared.type,
							}]
						}
						else {
							avslots[innerItem].push({
								"key": avctr,
								"customer": eventlist[index].summary,
								"startTime": moment(eventlist[index].start.dateTime).utc(),
								"endTime": moment(eventlist[index].end.dateTime).utc(),
								"slotid": eventlist[index].id,
								"employeeids": eventlist[index].extendedProperties.shared.for_employees,
								"eventType": eventlist[index].extendedProperties.shared.type,
								"duration": this.getDuration(eventlist[index].start.dateTime, eventlist[index].end.dateTime)
							})

							// Object.assign(slotsObj[item], { [ctr]: asd })
						}

						avctr = avctr + 1
					})
				}



			} else {

				console.log("different date")
			}
		})

		// console.warn("AVSLOTS", avslots)
		// console.log("============================================================================================================\n",
		// 	"SLOTS OBJ", slotsObj, 'TIMES', this.state.times, "EVENTLSIT", this.state.eventsListState


		// 	// moment("2019-09-18T11:00:00.000Z").utc().hour(),
		// 	// moment("2019-09-18T11:00:00.000Z").hour(),
		// 	// moment("2019-09-18T11:00:00.000Z").minute(),
		// 	// this.state.date.hour(),
		// 	// this.state.date,
		// 	// this.state.date.utc().hour(),

		// );


		await this.setState({ slots: slotsObj, slotsCopyState: slotsObj, availabilitySlots: avslots })


		// console.log("SLOTS PRINT", this.state.slots["1d87a860-bdcf-4752-b64f-692bc6a3a966"][0].startTime.format("HH:mm"));
		//  slot.startTime.clone().add(slot.duration, "minutes").format("HH:mm"))

	}

	getValidText = (firsttext, secondtext) => {
		var returnvalue = (firsttext === null ? secondtext : firsttext);
		return returnvalue
	}

	calculateTimes = async (currentDate, settings, value) => {



		if (!value && this.state.selectedMenuItem === 'Day') {
			const day = moment(currentDate).format("dddd");
			console.log("business open", settings[day].is_open)
			// console.warn(day + "calculate time" + currentDate + "settings" + settings)
			if (settings[day].is_open) {
				const startTime = parseInt(settings[day].open.split(':')[0]);
				const endTime = parseInt(settings[day].close.split(':')[1]) === 0 ? parseInt(settings[day].close.split(':')[0]) : parseInt(settings[day].close.split(':')[0]) + 1;
				const timesArray = Array.from(Array(endTime - startTime + 1), (_, i) => moment(currentDate).startOf('day').add(i + startTime, "hours"));
				// await this.setState({ showCalBool: true });
				return timesArray;
			}
			else {
				// await this.setState({ showCalBool: false });
				console.log("default time", Array.from(Array(16), (_, i) => moment().startOf('day').add(i + 7, "hours")))
				return Array.from(Array(16), (_, i) => moment().startOf('day').add(i + 7, "hours"));
			}

		} else {

			// for extracting 3 or 5
			let l = 0;
			if (value) {
				l = parseInt(value.substring(0, 1));
			} else {
				l = parseInt(this.state.selectedMenuItem.substring(0, 1));
			}

			// 
			const startsArray = [];
			const endsArray = [];

			for (let i = 0; i < l; i++) {
				let day = moment(currentDate).add(i, "days").format("dddd");

				// console.log(day, i, "LOOP DATA", "settings[day].is_open", settings[day].is_open)

				if (settings[day].is_open) {
					startsArray.push(parseInt(settings[day].open.split(':')[0]));
					endsArray.push(parseInt(settings[day].close.split(':')[1]) === 0 ? parseInt(settings[day].close.split(':')[0]) : parseInt(settings[day].close.split(':')[0]) + 1)
				}
				else {
					// console.log("IS CLOSED")
					continue;
				}

			}
			const startTime = _.min(startsArray);
			const endTime = _.max(endsArray);
			// console.log(startTime, endTime, "startTime, endTime,", startsArray, "startsArray", endsArray, "endsArray",
			//     "================================================================\n\n\n");

			// Array.from(Array(endTime - startTime + 1), (_, i) => moment(currentDate).startOf('day').add(i + startTime, "hours"));

			const timesArray = Array.from(Array(endTime - startTime + 1), (_, i) => moment(currentDate).startOf('day').add(i + startTime, "hours"));
			// console.log("3TO5DAYVIEW TIESARRA", timesArray)
			await this.setState((prevState) => {
				// console.log("rrtyrtyrtyrtyrty");
				return {
					...prevState,
					times: timesArray,
				}
			});


			return timesArray;
		}
	};

	getSelectedEmployee = async () => {

		const rvalue = '';
		Object.values(this.state.employees).map((item, index) => {
			if (item.isDone === true)
				rvalue = item.user.id
		})

		return rvalue;
	}

	getMultipleSlots = async (selectedEmp) => {
		var result = "";

		Object.values(selectedEmp).map(item => {
			if (item.isDone === true && result === "")
				result = item.user.id
		})

		// console.warn("MULTIPLE DAY VIEW KA ID", result, this.state.eventsListState)
		await this.get5dayShift(this.state.date, this.state.eventsListState, result)

	}

	onMenuChange = async (value, direction) => {

		console.log("VALUE AND DIRECTION", value, direction)
		if (value) {
			if (value === '3 Days' || value === '5 Days') {

				if (direction === undefined) {
					this.props.navigation.setParams({ isMenuVisible: !this.state.isMenuVisible });
				}
				this.props.navigation.setParams({ menuOption: value });



				// console.warn("COUNT OFF DONE", this.getSelectedCountWithDone())
				var newemploylist = {}, ctr = 0;


				if (this.getSelectedCountWithDone() > 1) {
					// Alert.alert("Alert", "You are allowed to choose only one employee for multiple day view")
					this.updateEmpList(this.state.employees, "req3")
				}


				await this.getMultipleSlots(this.state.employees);

				var openHourMultipleDaytemp = await this.getOpHoursMultiple()

				// console.warn("NEW OPENING HORFOEJNLEKN", openHourMultipleDaytemp)

				if (direction === undefined) {
					this.setState((prevState) => {
						// console.warn("rrtyrtyrtyrtyrty");
						return {
							...prevState,
							selectedMenuItem: value,
							isMenuVisible: !prevState.isMenuVisible,
							slots: this.state.multipleSlots,
							openHourMultipleDay: openHourMultipleDaytemp
						}
					});
				}
				else {
					this.setState((prevState) => {
						// console.warn("rrtyrtyrtyrtyrty");
						return {
							...prevState,
							selectedMenuItem: value,
							// isMenuVisible: !prevState.isMenuVisible,
							slots: this.state.multipleSlots,
							openHourMultipleDay: openHourMultipleDaytemp
						}
					});
				}



			} else {
				if (direction === undefined) {
					this.props.navigation.setParams({ isMenuVisible: !this.state.isMenuVisible });
				}
				this.props.navigation.setParams({ menuOption: value });


				if (direction === undefined) {
					this.setState((prevState) => {
						// console.warn("rrtyrtyrtyrtyrty");
						return {
							...prevState,
							selectedMenuItem: "Day",
							isMenuVisible: !prevState.isMenuVisible,
							slots: this.state.slotsCopyState,
						}
					});
				}
				else {
					this.setState((prevState) => {
						// console.warn("rrtyrtyrtyrtyrty");
						return {
							...prevState,
							selectedMenuItem: "Day",
							// isMenuVisible: !prevState.isMenuVisible,
							slots: this.state.slotsCopyState,
						}
					});
				}

				this.extractEventofDay(this.state.date, this.state.eventsListState, this.state.employees)
			}
		} else {
			this.props.navigation.setParams({ isMenuVisible: !this.state.isMenuVisible });
			this.setState((prevState) => {
				return { ...prevState, isMenuVisible: !prevState.isMenuVisible }
			});
		}
	};

	componentDidUpdate(nextProps, nextState, nextContext) {
		// console.log("test",nextProps)
		// console.log(this.state.date, this.state.selectedMenuItem);
	}

	checkIfToday = (date) => {
		return moment(date).isSame(moment(), "days");
	};

	isRowActive = (timeIndex, employeeIndex) => {
		if (timeIndex === this.state.activeRow) {
			if (employeeIndex) {
				if (employeeIndex === this.state.activeRowEmployee)
					return true;
				return false;
			} else if (employeeIndex === 0 && employeeIndex !== this.state.activeRowEmployee) {
				return false;
			} else {
				return true;
			}
		}
		return false;
	};

	onSwipe = async (state, direction) => {
		/*
						console.log(`You swiped ${direction}`);
		*/
		if (this.state.selectedMenuItem === 'Day') {
			if (direction === 'left') {
				const newDate = moment(this.state.date).add(1, "days");
				this.onDateChange(newDate);
			}
			if (direction === 'right') {
				const newDate = moment(this.state.date).subtract(1, "days");
				this.onDateChange(newDate);
			}
		}
		else {
			// Alert.alert("Please change the view to 1 day view only")
			if (direction === 'left') {
				var newDate = moment(this.state.date).add(1, "days");
				// this.onDateChange(newDate);
			}
			if (direction === 'right') {
				var newDate = moment(this.state.date).subtract(1, "days");
				// this.onDateChange(newDate);
			}

			await this.setState({ date: newDate })
			this.onMenuChange("Day", direction)
		}

	};



	renderTopRow = (itemdate) => {
		const viewNo = parseInt(this.state.selectedMenuItem.substring(0, 1));
		return (
			<View style={{ flex: 0, height: 70, width: '100%' }}>
				<View style={styles.rowStyle1}>
					{this.getSelectedCountWithDone() === 1 ? (this.state.selectedMenuItem === 'Day' ? <Fragment>
						<View style={{ flex: 1 }}>
						</View>
						<View style={{ flex: 7 }}>
							<View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
								<Text
									style={[styles.textStyle4, !this.checkIfToday(itemdate) ? { color: '#555555' } : {}]}>{moment(itemdate).format("DD")}</Text>
								<Text
									style={[styles.textStyle6, { marginLeft: 2 }, !this.checkIfToday(itemdate) ? { color: '#555555' } : {}]}>{moment(itemdate).format("ddd")}</Text>
							</View>
						</View>
					</Fragment> : <Fragment>
							<View style={{ flex: 1 }}>
							</View>
							<View style={{ flex: 7 }}>
								<View style={{
									flex: 1,
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center'
								}}>
									{Array.from(Array(viewNo), (_, i) => moment(itemdate).add(i, "days")).map((d, i) => (
										<View key={i}
											style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
											<Text
												style={[styles.textStyle4, !this.checkIfToday(d) ? { color: '#555555' } : {}]}>{moment(d).format("DD")}</Text>
											<Text
												style={[styles.textStyle6, { marginLeft: 2 }, !this.checkIfToday(d) ? { color: '#555555' } : {}]}>{moment(d).format("ddd")}</Text>

										</View>
									))
									}
								</View>
							</View>
						</Fragment>) : (<Fragment>
							<View style={{ flex: 1 }}>
								<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
									<Text
										style={[styles.textStyle4, !this.checkIfToday(itemdate) ? { color: '#555555' } : {}]}>{moment(itemdate).format("DD")}</Text>
									<Text
										style={[styles.textStyle6, { marginLeft: 2 }, !this.checkIfToday(itemdate) ? { color: '#555555' } : {}]}>{moment(itemdate).format("ddd")}</Text>
								</View>
							</View>
							<View style={{ flex: 7 }}>
								<View style={{
									flex: 1,
									flexDirection: 'row',
									justifyContent: 'space-between',
									alignItems: 'center'
								}}>
									{Object.values(this.state.employees).filter(e => e.isDone).map((employee, i) => (
										<View key={employee.user.id}
											style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
											<View style={[styles.mediumCircle, { backgroundColor: "rgba(150, 0, 0, 0.26)" }]}>
												<View style={{
													flex: 1, justifyContent: 'center', alignItems: 'center'
												}}>
													{(employee.user.image_id ?
														<Image source={{ uri: employee.user.image_id }}
															style={{
																width: 34,
																height: 34,
																borderRadius: 34 / 2,
															}}
															resizeMode={"cover"} /> : <Text style={{
																fontFamily: 'open-sans-hebrew',
																fontSize: 18,
																color: 'rgba(255,255,255,0.87)'
															}}>{employee.user.first_name !== null ? employee.user.first_name.substring(0, 1) : employee.nickname.substring(0, 1)}</Text>)}
												</View>
											</View>
											<Text>{employee.user.first_name !== null ? employee.user.first_name : employee.nickname}</Text>
										</View>
									))}
								</View>
							</View>
						</Fragment>)}
				</View>
			</View>
		);
	};

	renderEmployeeModalContent = () => (
		<View style={{
			height: 440, backgroundColor: 'white',
			padding: 0,
			justifyContent: 'center',
			alignItems: 'center',
			borderColor: 'rgba(0, 0, 0, 0.1)',
		}}>
			<View style={{
				flex: 1, height: 65, width: '100%', backgroundColor: '#fff', ...Platform.select({
					ios: {
						shadowColor: 'black',
						shadowOffset: { height: -5 },
						shadowOpacity: 0.16,
						shadowRadius: 5,
					},
					android: {
						elevation: 5,
					}
				})
			}}>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start', paddingLeft: 24 }}>
					<Text style={styles.textStyle8}>Select Employees <Text
						style={[styles.textStyle5, { paddingLeft: 15 }]}>{this.getSelectedCount() > 0 ? `(${this.getSelectedCount()} Selected)` : ``}</Text>
					</Text>
				</View>
			</View>


			<View style={{ flex: 0, height: 440 - 73 - 65, width: '100%' }}>
				<ScrollView>
					<View style={{ paddingTop: 10, paddingBottom: 10 }}>
						{Object.values(this.state.employees).map((employee, index) => (

							<TouchableWithoutFeedback key={employee.user.id}
								onPress={() => this.toggleEmployeeSelected(employee.user.id)}
							>
								<View
									key={employee.user.id} style={{
										flex: 1,
										flexDirection: 'row',
										width: '100%',
										height: 40,
										justifyContent: 'center',
										alignItems: 'center',
										marginTop: 7,
										marginBottom: 9
									}}>
									<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
										<View
											style={[styles.circle, (employee.selected ? {} : { backgroundColor: 'rgba(150, 0, 0, 0.26)' })]}>
											<View style={{
												flex: 1, justifyContent: 'center', alignItems: 'center',
											}}>
												{employee.selected ? (
													<Icon name="check" type={"solid"} size={19}
														color={"#fff"} />
												) : (employee.user.image_id ? <Image source={{ uri: employee.user.image_id }}
													style={{
														width: 40,
														height: 40,
														borderRadius: 40 / 2
													}}
													resizeMode={"cover"} /> :
													<Text style={{
														fontFamily: 'open-sans-hebrew',
														fontSize: 23,
														color: 'rgba(255,255,255,0.87)'
													}}>{employee.user.first_name !== null ? employee.user.first_name.substring(0, 1) : employee.nickname.substring(0, 1)}</Text>)}
											</View>
										</View>
									</View>
									<View style={{
										flex: 3, justifyContent: 'space-evenly',
									}}>
										<Text
											style={[styles.contentTitle, { color: employee.selected ? '#287F7E' : 'rgba(0,0,0,0.87)' }]}>{employee.user.first_name !== null ? employee.user.first_name : employee.nickname}</Text>
									</View>
									<View style={{
										flex: 1, alignItems: 'center',
										paddingRight: 7,
									}}>
									</View>
								</View></TouchableWithoutFeedback>

						))}
					</View>
				</ScrollView>
			</View>
			<View style={{
				flex: 1, height: 73, width: '100%', flexDirection: 'row', backgroundColor: '#fff', ...Platform.select({
					ios: {
						shadowColor: 'black',
						shadowOffset: { height: -10 },
						shadowOpacity: 0.16,
						shadowRadius: 10,
					},
					android: {
						elevation: 10,
					}
				})
			}}>
				<View style={{ flex: 4, justifyContent: 'center', alignItems: 'flex-end' }}>
					<EleButton title={"CANCEL"} type={"clear"}
						titleStyle={{ fontFamily: 'open-sans-hebrew-bold', fontSize: 14, color: '#888888' }}

						onPress={() => {
							this.toggleEmployeeModal();

							this.setState(prevState => {
								const selectedEmp = {}

								Object.values(prevState.employees).map(emp => {
									selectedEmp[emp.user.id] = emp;
									if (emp.isDone == true) {
										selectedEmp[emp.user.id].selected = true
									}
									else {
										selectedEmp[emp.user.id].selected = false
									}

								})
								return {
									...prevState, employees: selectedEmp
								}
							})
						}}
					/>
				</View>
				<View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
					{this.state.atleastOne == true ? <EleButton title={"DONE"} type={"clear"}
						titleStyle={{ fontFamily: 'open-sans-hebrew-bold', fontSize: 14, color: '#287F7E' }}

						onPress={async () => {
							this.toggleEmployeeModal()


							await this.setState((prevState) => {
								const selectedEmp = {}

								Object.values(prevState.employees).map(emp => {
									selectedEmp[emp.user.id] = emp;
									if (emp.selected == true) {
										selectedEmp[emp.user.id].isDone = true
									}
									else {
										selectedEmp[emp.user.id].isDone = false
									}

								})
								this.props.navigation.setParams({ employees: selectedEmp });



								return {
									...prevState, employees: selectedEmp
								}



							})

							if (this.state.selectedMenuItem !== "Day") {
								await this.getMultipleSlots(this.state.employees)
								this.setState({ slots: this.state.multipleSlots })
							}
						}}
					/> : <EleButton title={"DONE"} color={"#CCCCCC"} disabled />}
				</View>
			</View>
		</View>
	);

	renderEvents = (slot, j, key) => {
		const { times, rowHeight, minDuration, selectedMenuItem } = this.state;

		return (
			<View key={j} style={[{
				position: 'absolute',
				top: times.reduce((acc, cv, ci) => {
					if (cv.hours() <= slot.startTime.hours())
						acc += rowHeight;
					return acc;
				}, 0) + (slot.startTime.minutes !== 0 ? (slot.startTime.minutes() / 60) * rowHeight : 0),
				height: (slot.duration / 60) * rowHeight,
				width: this.calculateWidths(slot, j, key),
				left: this.calculateLefts(slot, j, key),
				zIndex: 10,
				padding: 1,
				paddingBottom: 2,
			},]}>
				{
					slot.type && slot.type === 'break' ?
						<TouchableHighlight style={[{
							flex: 1,
						}, slot.duration < minDuration ? {
							justifyContent: 'center',
						} : {}]}
							onPress={() => {
								// console.log("BRAEKESLOTT", slot)
								this.props.navigation.navigate("BreakView",
									{ Breakdata: slot, deleteBreakIdCallback: this.deleteBreakId })
							}}
						>
							<ImageBackground
								source={require('./../assets/images/line-dark-background.png')}
								resizeMode={"cover"}
								style={[{
									flex: 1,
									borderRadius: 2,
									paddingLeft: 5,
									paddingTop: 5,
								}, slot.duration < minDuration ? {
									justifyContent: 'center',
									paddingLeft: 2,
									paddingTop: 2
								} : {}]}
								imageStyle={{ borderRadius: 2 }}>
								<View >
									<Fragment><Text
										style={[styles.textStyle1, slot.duration < minDuration ? { fontSize: 9 } : {}]}>
										{slot.customer}
									</Text>
										{slot.duration < minDuration && this.getSelectedCount() <= 2 && selectedMenuItem === 'Day' ?
											<Text
												style={styles.textStyle3}>{slot.duration} m</Text> : null}
										{this.getSelectedCount() <= 2 && slot.duration > minDuration ?
											<Text
												style={styles.textStyle2}>{slot.startTime.format("HH:mm")} - {slot.startTime.clone().add(slot.duration, "minutes").format("HH:mm")}</Text> : null}
									</Fragment>
								</View>
							</ImageBackground>
						</TouchableHighlight> :

						<TouchableOpacity
							activeOpacity={0.5} onPress={() => {
								//console.log("APPOINTMENTSLOTT", slot);
								this.props.navigation.navigate("AppointmentView",
									{ slot: slot, deleteAptIdCallback: this.deleteAppointmentId }
								)
							}}
							style={[{
								flex: 1,
								backgroundColor: slot.serviceColor,
								borderRadius: 2,
								paddingLeft: 5,
								paddingTop: 5,
								borderLeftWidth: 4,
								borderLeftColor: slot.serviceColor + "B3"
							}, slot.duration < minDuration ? {
								justifyContent: 'center',
								paddingLeft: 2,
								paddingTop: 2
							} : {}]}>
							{/* TEMP CHANGES */}
							<View
							>
								<Fragment>
									<Text
										style={[styles.textStyle1, slot.duration < minDuration ? { fontSize: 9 } : {}]}>
										{slot.customer}
									</Text>
									{slot.duration < minDuration && this.getSelectedCount() <= 2 && selectedMenuItem === 'Day' ?
										<Text
											style={styles.textStyle3}>{slot.duration} m</Text> : null}
									{this.getSelectedCount() <= 2 && slot.duration > minDuration ?
										<Text
											style={styles.textStyle2}>{slot.startTime.format("HH:mm")} - {slot.startTime.clone().add(slot.duration, "minutes").format("HH:mm")}</Text> : null}
								</Fragment>
							</View>
						</TouchableOpacity>
				}
			</View>
		);
	};

	renderCurrentTime = () => {
		const { times, rowHeight } = this.state;
		return (
			moment().isSame(moment(this.state.date), "day") ?
				<Fragment><View style={[{
					position: 'absolute',
					zIndex: 12,
					top: times.reduce((acc, cv, ci) => {
						if (cv.hours() <= moment().hours())
							acc += rowHeight;
						return acc;
					}, 0) + (moment().minutes !== 0 ? (moment().minutes() / 60) * rowHeight : 0),
					height: 6,
					width: 6,
					left: -3,
					borderRadius: 3,
					backgroundColor: '#287F7E'
				},]} />
					<View style={[{
						position: 'absolute',
						top: times.reduce((acc, cv, ci) => {
							if (cv.hours() <= moment().hours())
								acc += rowHeight;
							return acc;
						}, 2) + (moment().minutes !== 0 ? (moment().minutes() / 60) * rowHeight : 0),
						height: 2,
						width: '100%',
						left: 2,
						zIndex: 12,
						backgroundColor: '#287F7E'
					},]} /></Fragment> : null
		);
	};


	renderCurrentTimeMultipleDays = () => {
		const { times, rowHeight } = this.state;
		return (
			moment().isSame(moment(this.state.date), "day") ?
				<Fragment><View style={[{
					position: 'absolute',
					top: times.reduce((acc, cv, ci) => {
						if (cv.hours() <= moment().hours())
							acc += rowHeight;
						return acc;
					}, 0) + (moment().minutes !== 0 ? (moment().minutes() / 60) * rowHeight : 0),
					height: 6,
					width: 6,
					left: -3,
					borderRadius: 3,
					backgroundColor: '#287F7E'
				},]} />
					<View style={[{
						position: 'absolute',
						top: times.reduce((acc, cv, ci) => {
							if (cv.hours() <= moment().hours())
								acc += rowHeight;
							return acc;
						}, 2) + (moment().minutes !== 0 ? (moment().minutes() / 60) * rowHeight : 0),
						height: 2,
						width: this.state.selectedMenuItem === "3 Days" ? "33.33%" : "20%",
						left: 2,
						backgroundColor: '#287F7E'
					},]} /></Fragment> : null
		);
	};

	getMinsfromGivenTime(timeparam, type) {
		var mins = 0;
		var time = moment(timeparam, "HH:mm:ss");
		if (type === "start") {
			mins = (time.hour() * 60) + time.minute();
		}
		else if (type === "end") {
			mins = ((24 - time.hour()) * 60) + time.minute();
		}
		else {
			mins = (time.hour() * 60) + time.minute();
		}

		console.log(mins, type);

		return mins;
	}

	getHeight = (date) => {

		// (this.state.officehours[moment(this.state.date).format("dddd")].is_open === true ? this.getMinsfromGivenTime(this.state.officehours[moment(this.state.date).format("dddd")].open, "start") + 60 : 1440);
		// console.warn(this.state.date)
		if (this.state.officehours.length === 0)
			return 0;
		else {
			// console.warn("OFFICEHHHH", this.state.officehours[moment(this.state.date).format("dddd")].is_open)
			if (this.state.officehours[moment(date).format("dddd")].is_open === true)
				return this.getMinsfromGivenTime(this.state.officehours[moment(date).format("dddd")].open, "start") + 60;
			else
				return 1440;
		}
	}

	getclosingheight = (date) => {
		if (this.state.officehours.length === 0)
			return 0;
		else {
			// console.warn("OFFICEHHHH", this.state.officehours[moment(this.state.date).format("dddd")].is_open)
			if (this.state.officehours[moment(date).format("dddd")].is_open === true) {
				// console.warn(" NEW CLSOING MIN ", this.getMinsfromGivenTime(this.state.officehours[moment(this.state.date).format("dddd")].close, "end"))
				return this.getMinsfromGivenTime(this.state.officehours[moment(date).format("dddd")].close, "end") + 60;
			}
			else
				return 0;
		}
	}

	getTopmargin = (date) => {
		if (this.state.officehours.length === 0)
			return 0;
		else {
			// (this.state.officehours.length === 0 ? 0 : (this.state.officehours[moment(this.state.date).format("dddd")].is_open === true ? this.getMinsfromGivenTime(this.state.officehours[moment(this.state.date).format("dddd")].close, "middle") + 60 : 0)),
			// console.warn("OFFICEHHHH", this.state.officehours[moment(this.state.date).format("dddd")].is_open)
			if (this.state.officehours[moment(date).format("dddd")].is_open === true) {
				// console.warn("TOP MARGIN", this.getMinsfromGivenTime(this.state.officehours[moment(date).format("dddd")].close, "middle") + 60, this.state.officehours[moment(date).format("dddd")].open, this.state.officehours[moment(date).format("dddd")].close)
				return this.getMinsfromGivenTime(this.state.officehours[moment(date).format("dddd")].close, "middle") + 60;
			}
			else
				return 0;
		}
	}




	async	OnSwiperAction(newIndex) {
		// this.swiper.scrollBy(1);
		// console.warn(newIndex)
		// SHOWING THE LOADER 
		await this.setState({ isLoading: true })
		let tempDateArray = [...this.state.DaysOfData];
		// console.warn("BEFORE", tempDateArray)

		if (newIndex === 0) {
			tempDateArray[1].calDate = moment(tempDateArray[0].calDate).add(1, "day");
			tempDateArray[2].calDate = moment(tempDateArray[0].calDate).subtract(1, "day");
			tempDateArray[0].visibility = true, tempDateArray[1].visibility = false, tempDateArray[2].visibility = false;
		}
		else if (newIndex === 1) {
			tempDateArray[0].calDate = moment(tempDateArray[1].calDate).subtract(1, "day");
			tempDateArray[2].calDate = moment(tempDateArray[1].calDate).add(1, "day");
			tempDateArray[0].visibility = false, tempDateArray[1].visibility = true, tempDateArray[2].visibility = false;
		}
		else if (newIndex === 2) {
			tempDateArray[0].calDate = moment(tempDateArray[2].calDate).add(1, "day");
			tempDateArray[1].calDate = moment(tempDateArray[2].calDate).subtract(1, "day");
			tempDateArray[0].visibility = false, tempDateArray[1].visibility = false, tempDateArray[2].visibility = true;
		}
		else {
		}


		// // tempDateArray[0].calDate = moment(tempDateArray[0].calDate).add(1, "day")
		// // tempDateArray[1].calDate = moment(tempDateArray[1].calDate).add(1, "day")
		// // tempDateArray[2].calDate = moment(tempDateArray[2].calDate).add(1, "day")

		await this.setState({ DaysOfData: tempDateArray, date: tempDateArray[newIndex].calDate, swiperIndexState: newIndex })
		console.warn("NEW DATE IS", this.state.date, "SWIPR INDEX IS", this.state.swiperIndexState)
		this.props.navigation.setParams({ date: moment(this.state.date) });
		// console.warn("AFTER", tempDateArray)
		// console.warn("====================================================================================")
		// CLOSING THE LOADER
		await this.extractEventofDay(this.state.date, this.state.eventsListState, this.state.employees)

		setTimeout(() => {
			this.setState({ isLoading: false })
		}, 1);

	}





	render() {

		const config = {
			velocityThreshold: 0.9,
			directionalOffsetThreshold: 2000
		};

		// console.warn("RENDER() EMPLOYEES", this.state.employees)
		const { rowHeight, times, slots, left, widths, employees, minDuration, selectedMenuItem } = this.state;
		const viewNo = parseInt(this.state.selectedMenuItem.substring(0, 1));
		return (

			<Swiper
				loop={true}
				index={1}
				// onScrollBeginDrag={(e, { index }, context) => this.setState({ swiperOldIndex: index })}
				onMomentumScrollEnd={(e, { index }, context) => this.OnSwiperAction(index)}
			// onScrollBeginDrag={(e, { index }, context) => this.OnSwiperBeginDragFunc(index)}
			// onMomentumScrollEnd={(value) => this.OnSwiperAction(value)}
			>
				{
					this.state.DaysOfData !== undefined ? (
						this.state.DaysOfData.map((SwiperObject, SwiperIndex) => {
							return (

								<View
									// config={config}
									// onSwipeLeft={(state) => this.onSwipe(state, "left")}
									// onSwipeRight={(state) => this.onSwipe(state, "right")}
									style={{
										flex: 1,
										backgroundColor: this.state.backgroundColor
									}}
								>
									{this.props.isLoading &&
										<LoadingAnimation visible={this.props.isLoading} />
									}

									{this.state.isLoading &&
										<LoadingAnimation visible={this.state.isLoading} />
									}
									<TouchableWithoutFeedback
										style={{ flex: 1 }} onPress={() => {
											if (this.props.navigation.getParam("blur", false)) {
												this.props.navigation.setParams({ blur: false });
												this.setState({
													activeRow: null,
													activeRowEmployee: null,
													longPressState: 'plus'
												});
											}
										}
										}>
										<View style={[{ flex: 1 }, this.props.navigation.getParam("blur", false) ? {
											backgroundColor: '#fff',
											opacity: 0.1
										} : {}]}>
											<Modal
												isVisible={this.state.employeeModalVisible}
												animationIn={"fadeIn"}
												animationOut={"fadeOut"}
												animationInTiming={100}
												animationOutTiming={10}
												backdropTransitionInTiming={100}
												backdropTransitionOutTiming={10}
												swipeDirection={['up', 'down']}
												hideModalContentWhileAnimating

												onSwipeComplete={() => this.toggleEmployeeModal()}
												onBackdropPress={() => this.toggleWithBackDrop()}
												onBackButtonPress={() => this.toggleWithBackDrop()}
												backdropColor={'#292929'}
												backdropOpacity={0.4}
												onModalHide={() => {
												}}
											>
												{this.renderEmployeeModalContent()}
											</Modal>

											{this.renderTopRow(SwiperObject.calDate)}
											<ScrollView scrollEnabled={!this.props.navigation.getParam("blur", false)}>
												<View style={styles.rowStyle1}>


													<View style={{ flex: 1 }}>
														{this.state.times.map((time, i) => (<View key={time} style={{
															flex: 0,
															height: i === 0 ? rowHeight + 5 : rowHeight,
															width: '100%',
															justifyContent: 'flex-end',
															alignItems: 'center'
														}}>
															<Text
																style={[{ fontSize: 10 }, moment().hours() === time.hours() && moment().isSame(moment(this.state.date), "day") ? { color: '#287F7E' } : {}, this.isRowActive(i + 1) ? styles.textStyle9 : {}]}>{time.format("HH:mm")}</Text>
														</View>))}
													</View>


													<View
														style={styles.boxContainer}>
														{this.state.selectedMenuItem === 'Day' ?
															<View style={styles.rowStyle1}>
																{Object.values(this.state.employees).filter(e => e.isDone).map((employee, j) => (
																	<View key={employee.user.id}
																		style={styles.rightBorder}>
																		{this.state.times.map((time, i) => (i === 0 ?
																			<TouchableOpacity activeOpacity={1} key={time}
																				style={[{ height: rowHeight }, styles.touchableStyle1, this.isRowActive(i, j) ? styles.touchableStyle2 : styles.touchableStyle1]}
																				onPress={() => {
																					if (this.props.navigation.getParam("blur", false)) {
																						this.props.navigation.setParams({ blur: false });
																						this.setState({
																							activeRow: null,
																							activeRowEmployee: null,
																							longPressState: 'plus'
																						});
																					}
																				}}
																				onLongPress={() => {
																					this.setState({
																						activeRow: i,
																						activeRowEmployee: j,
																						longPressState: 'closed-rows'
																					});
																					if (this.props.navigation.getParam("blur", false))
																						this.props.navigation.setParams({ blur: false });
																					else
																						this.props.navigation.setParams({ blur: true });
																				}}
																			>
																				{/* <ImageBackground
                                                            source={require('./../assets/images/line-background.png')}
                                                            style={{
                                                                width: '100%',
                                                                height: '100%',
                                                            }} resizeMode={"cover"}>
                                                            </ImageBackground> */}
																			</TouchableOpacity> :
																			<TouchableOpacity activeOpacity={1} key={time}
																				style={[{ height: rowHeight }, styles.touchableStyle1, this.isRowActive(i, j) ? styles.touchableStyle2 : styles.touchableStyle1]}
																				onPress={() => {
																					if (!this.props.navigation.getParam("blur", false))
																						this.props.navigation.navigate("SelectService", { time: time });
																					else {
																						this.props.navigation.setParams({ blur: false });
																						this.setState({
																							activeRow: null,
																							activeRowEmployee: null,
																							longPressState: 'plus'
																						});
																					}
																				}}
																				onLongPress={() => {
																					this.setState({
																						activeRow: i,
																						activeRowEmployee: j,
																						longPressState: 'hour-rows'
																					});
																					if (this.props.navigation.getParam("blur", false))
																						this.props.navigation.setParams({ blur: false });
																					else
																						this.props.navigation.setParams({ blur: true });
																				}}
																			>
																			</TouchableOpacity>))}
																		<TouchableOpacity activeOpacity={1}
																			style={[{ height: rowHeight / 2 }, styles.touchableStyle3, this.isRowActive(25, j) ? styles.touchableStyle4 : styles.touchableStyle3]}
																			onPress={() => {
																				if (this.props.navigation.getParam("blur", false)) {
																					this.props.navigation.setParams({ blur: false });
																					this.setState({
																						activeRow: null,
																						activeRowEmployee: null,
																						longPressState: 'plus'
																					});
																				}
																			}}
																			onLongPress={() => {
																				this.setState({
																					activeRow: 25,
																					activeRowEmployee: j,
																					longPressState: 'closed-rows'
																				});
																				if (this.props.navigation.getParam("blur", false))
																					this.props.navigation.setParams({ blur: false });
																				else
																					this.props.navigation.setParams({ blur: true });
																			}}>
																			<Image
																				source={require('./../assets/images/line-background.png')}
																				style={{
																					width: '100%',
																					height: '100%'
																				}} resizeMode={"repeat"}>
																			</Image>
																		</TouchableOpacity>



																		{/* OPENING TIME */}
																		<TouchableOpacity
																			activeOpacity={1}
																			style={{
																				width: '100%',
																				height: this.state.openingHeight,
																				zIndex: 4,
																				position: 'absolute',
																				top: 0,
																				// backgroundColor: 'red',
																			}}
																		>
																			<Image
																				source={require('./../assets/images/line-background.png')}
																				style={{
																					width: '100%',
																					height: this.state.openingHeight,
																					zIndex: 4,
																					position: 'absolute',
																					top: 0,
																					borderRadius: 1,
																					// backgroundColor: 'blue',
																				}} resizeMode={'cover'}>
																			</Image>
																		</TouchableOpacity>



																		{/* CLOSING TIME */}
																		<TouchableOpacity
																			activeOpacity={1}
																			style={{
																				width: '100%',
																				flexDirection: 'row',
																				// borderRadius: 1,
																				height: this.state.closingheight,
																				zIndex: 8,
																				backgroundColor: '#00000033',
																				position: 'absolute',
																				top: this.state.closingTopmargin,
																			}}
																		>
																			<Image
																				source={require('./../assets/images/line-background.png')}
																				style={{
																					width: '100%',
																					borderRadius: 1,
																					height: this.state.closingheight,
																					zIndex: 20,
																					position: 'absolute',
																					// top: this.state.closingTopmargin,
																					// backgroundColor: 'red',
																				}} resizeMode={'cover'}>
																			</Image>
																		</TouchableOpacity>


																		{

																			this.state.availabilitySlots[employee.user.id] !== undefined && this.state.officehours !== undefined ?

																				(

																					this.state.availabilitySlots[employee.user.id].map((slot, index) =>
																						<RenderAvailEvents
																							rowHeight={rowHeight}
																							selectedMenuItem={selectedMenuItem}
																							minDuration={minDuration}
																							times={times}
																							allSlots={this.state.availabilitySlots}
																							employeeid={employee.user.id}
																							employees={this.state.employees}
																							slot={slot}
																							index={index}
																							onPressEvent={() => {
																								// console.log("BRAEKESLOTT", slot)
																								this.props.navigation.navigate("AvailableSlotView",
																									{ Breakdata: slot, deleteBreakIdCallback: this.deleteAvaialbleSlotId })
																							}}
																						/>
																					)
																				) : null
																		}

																		{
																			this.state.slots[employee.user.id] !== undefined && SwiperObject.visibility ? (
																				this.state.slots[employee.user.id].map((slot, j) => this.renderEvents(slot, j, employee.user.id))
																			) : null
																		}



																		{this.renderCurrentTime()}
																	</View>
																))}
															</View> : <View style={styles.rowStyle1}>
																{Array.from(Array(viewNo), (_, j) => moment(this.state.date).add(j, "days")).map((day, j) => (

																	<View key={j}
																		style={styles.rightBorder}>
																		{this.state.times.map((time, i) => (i === 0 ?
																			<TouchableOpacity activeOpacity={1} key={time}
																				style={[{ height: rowHeight }, styles.touchableStyle1, this.isRowActive(i, j) ? styles.touchableStyle2 : styles.touchableStyle1]}
																				onPress={() => {
																					if (this.props.navigation.getParam("blur", false)) {
																						this.props.navigation.setParams({ blur: false });
																						this.setState({
																							activeRow: null,
																							activeRowEmployee: null,
																							longPressState: 'plus'
																						});
																					}
																				}}
																				onLongPress={() => {
																					this.setState({
																						activeRow: i,
																						activeRowEmployee: j,
																						longPressState: 'closed-rows'
																					});
																					if (this.props.navigation.getParam("blur", false))
																						this.props.navigation.setParams({ blur: false });
																					else
																						this.props.navigation.setParams({ blur: true });
																				}}
																			><ImageBackground
																				source={require('./../assets/images/line-background.png')}
																				style={{
																					width: '100%',
																					height: '100%'
																				}} resizeMode={"cover"}>
																				</ImageBackground>
																			</TouchableOpacity> :
																			<TouchableOpacity activeOpacity={1} key={time}
																				style={[{ height: rowHeight }, styles.touchableStyle1, this.isRowActive(i, j) ? styles.touchableStyle2 : styles.touchableStyle1]}
																				onPress={() => {
																					if (!this.props.navigation.getParam("blur", false))
																						this.props.navigation.navigate("SelectService", { time: time });
																					else {
																						this.props.navigation.setParams({ blur: false });
																						this.setState({
																							activeRow: null,
																							activeRowEmployee: null,
																							longPressState: 'plus'
																						});
																					}
																				}}
																				onLongPress={() => {
																					this.setState({
																						activeRow: i,
																						activeRowEmployee: j,
																						longPressState: 'hour-rows'
																					});
																					if (this.props.navigation.getParam("blur", false))
																						this.props.navigation.setParams({ blur: false });
																					else
																						this.props.navigation.setParams({ blur: true });
																				}}
																			>
																			</TouchableOpacity>))}
																		<TouchableOpacity activeOpacity={1}
																			style={[{ height: rowHeight / 2 }, styles.touchableStyle3, this.isRowActive(25, j) ? styles.touchableStyle4 : styles.touchableStyle3]}
																			onPress={() => {
																				if (this.props.navigation.getParam("blur", false)) {
																					this.props.navigation.setParams({ blur: false });
																					this.setState({
																						activeRow: null,
																						activeRowEmployee: null,
																						longPressState: 'plus'
																					});
																				}
																			}}
																			onLongPress={() => {
																				this.setState({
																					activeRow: 25,
																					activeRowEmployee: j,
																					longPressState: 'closed-rows'
																				});
																				if (this.props.navigation.getParam("blur", false))
																					this.props.navigation.setParams({ blur: false });
																				else
																					this.props.navigation.setParams({ blur: true });
																			}}>
																			<ImageBackground
																				source={require('./../assets/images/line-background.png')}
																				style={{
																					width: '100%',
																					height: '100%'
																				}} resizeMode={"cover"}>
																			</ImageBackground>
																		</TouchableOpacity>




																		{this.state.availabilitySlots[day.format("YYYY-MM-DD")] === undefined ? null : (
																			this.state.availabilitySlots[day.format("YYYY-MM-DD")].map((slot, index) =>
																				<RenderAvailEvents
																					rowHeight={rowHeight}
																					selectedMenuItem={selectedMenuItem}
																					minDuration={minDuration}
																					times={times}
																					allSlots={this.state.availabilitySlots}
																					employeeid={day.format("YYYY-MM-DD")}
																					employees={this.state.employees}
																					slot={slot}
																					onPressEvent={() => {
																						// console.log("BRAEKESLOTT", slot)
																						this.props.navigation.navigate("AvailableSlotView",
																							{ Breakdata: slot, deleteBreakIdCallback: this.deleteAvaialbleSlotId })
																					}}
																					index={index} />
																			)
																		)
																		}



																		{/* OPENING TIME */}
																		<TouchableOpacity
																			activeOpacity={1}
																			style={{
																				width: '100%',
																				height: this.state.openHourMultipleDay[j].openheight,
																				zIndex: 4,
																				position: 'absolute',
																				top: 0,
																				// backgroundColor: 'red',
																			}}
																		>
																			<Image
																				source={require('./../assets/images/line-background.png')}
																				style={{
																					width: '100%',
																					height: this.state.openHourMultipleDay[j].openheight,
																					zIndex: 4,
																					position: 'absolute',
																					top: 0,
																					borderRadius: 1,
																					// backgroundColor: 'blue',
																				}} resizeMode={'cover'}>
																			</Image>
																		</TouchableOpacity>




																		{/* CLOSING TIME */}
																		<TouchableOpacity
																			activeOpacity={1}
																			style={{
																				width: '100%',
																				flexDirection: 'row',
																				// borderRadius: 1,
																				height: this.state.openHourMultipleDay[j].closeheight,
																				zIndex: 8,
																				backgroundColor: '#00000033',
																				position: 'absolute',
																				top: this.state.openHourMultipleDay[j].topMargin,
																			}}
																		>
																			<Image
																				source={require('./../assets/images/line-background.png')}
																				style={{
																					width: '100%',
																					borderRadius: 1,
																					height: this.state.openHourMultipleDay[j].closeheight,
																					zIndex: 20,
																					position: 'absolute',
																					// top: this.state.closingTopmargin,
																					// backgroundColor: 'red',
																				}} resizeMode={'cover'}>
																			</Image>
																		</TouchableOpacity>



																		{/* (<View style={{ width: 100, height: 100, backgroundColor: 'red' }}><Text>Business Closed</Text></View>) */}
																		{this.state.slots[day.format("YYYY-MM-DD")] === undefined ? null : (

																			this.state.slots[day.format("YYYY-MM-DD")].map((slot, j) => this.renderEvents(slot, j, day.format("YYYY-MM-DD")))
																		)}

																	</View>

																))}
																{this.renderCurrentTimeMultipleDays()}
															</View>}
													</View>
												</View>
											</ScrollView>
										</View>
									</TouchableWithoutFeedback>
									{this.props.navigation.getParam("blur", false) ?
										<View style={{ flex: 1, width: '100%', height: 150, position: 'absolute', bottom: 20, right: 20 }}>
											{this.state.longPressState === 'closed-rows' ? <View
												style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
												<View style={{ flex: 3 }} />
												<View style={{ flex: 2, alignItems: 'flex-end' }}>
													<Text style={styles.textStyle7}>Modify Opening Hours</Text>
												</View>
												<EleButton title={""}
													icon={<Icon name={"pencil"} type={"regular"} size={18} color={"#287F7E"} />}
													buttonStyle={styles.smallButtonStyle}
													onPress={() => this.props.navigation.navigate("OpeningHours")}
													containerStyle={{ flex: 1, alignItems: 'center' }}
												/>
											</View> : null}
											{this.state.longPressState === 'closed-rows' || this.state.longPressState === 'plus' ? <View
												style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center' }}>
												<View style={{ flex: 3 }} />
												<View style={{ flex: 2, alignItems: 'flex-end' }}>
													<Text style={styles.textStyle7}>New Slot</Text>
												</View>
												<EleButton title={""}
													icon={<Icon name={"expand"} type={"regular"} size={18} color={"#287F7E"} />}
													buttonStyle={styles.smallButtonStyle}
													onPress={() => {
														this.props.navigation.setParams({ blur: false });
														this.props.navigation.navigate("AddBreak", { page: 'slot' })
													}}
													containerStyle={{ flex: 1, alignItems: 'center' }}
												/>
											</View> : null}
											{this.state.longPressState === 'hour-rows' || this.state.longPressState === 'plus' ?
												<View style={{
													flex: 1,
													flexDirection: 'row',
													justifyContent: 'flex-end',
													alignItems: 'center'
												}}>
													<View style={{ flex: 3 }} />
													<View style={{ flex: 2, alignItems: 'flex-end' }}>
														<Text style={styles.textStyle7}>New Break</Text>
													</View>
													<EleButton title={""}
														icon={<Icon name={"mug-hot"} type={"regular"} size={18} color={"#287F7E"} />}
														buttonStyle={styles.smallButtonStyle}
														onPress={() => {

															this.props.navigation.setParams({ blur: false });
															this.props.navigation.navigate('AddBreak', { page: 'break' })
														}}
														containerStyle={{ flex: 1, alignItems: 'center' }}
													/>
												</View> : null}
											<View style={{ flex: 1, flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', paddingTop: 6 }}>
												<View style={{ flex: 3 }} />
												<View style={{ flex: 2, alignItems: 'flex-end' }}>
													<Text style={styles.textStyle7}>New Appointment</Text>
												</View>
												<EleButton title={""}
													icon={<Icon name={"calendar-plus"} type={"solid"} size={20} color={"#FFFFFF"} />}
													buttonStyle={styles.bigButtonStyle}
													onPress={() => {
														this.props.navigation.setParams({ blur: false });
														this.props.navigation.navigate("SelectService")
													}}
													containerStyle={{ flex: 1, alignItems: 'center' }}
												/>
											</View>
										</View> : null}
									<View style={{
										backgroundColor: '#fff',
									}}>
										<SnackBarComponent ref="ReactNativeSnackBar" />
									</View>
									{this.state.isConnected ? null :
										<View style={styles.NetworkContainter}>
											<Text style={styles.NetworkMessage}>No Internet Connection</Text>
										</View>}

								</View>

							);
						})
					) : null
				}
			</Swiper>

		)
	}
}


const mapStateToProps = (state) => (console.log("state.getBusinessByAliases.pendingAvailabilitySlot,", state.getBusinessByAliases.pendingAvailabilitySlot), {
	businesses: state.getBusinessByAliases.allBusinesses,
	name: state.getBusinessByAliases.businessName,
	employees: state.getBusinessByAliases.employees,
	isLoading: state.getBusinessByAliases.isFatching,
	events: state.getBusinessByAliases.events,
	services: state.getBusinessByAliases.services,
	customers: state.getBusinessByAliases.customers,
	openingHours: state.getBusinessByAliases.opening_hours,
	//snackbar
	pendingBusiness: state.getBusinessByAliases.pendingBusiness,
	createBError: state.getBusinessByAliases.createBError,
	pendingAppointment: state.getBusinessByAliases.pendingAppointment,
	createAppError: state.getBusinessByAliases.createAppError,
	pendingBusyBlock: state.getBusinessByAliases.pendingBusyBlock,
	pendingAvailabilitySlot: state.getBusinessByAliases.pendingAvailabilitySlot,
	createBlockError: state.getBusinessByAliases.createBlockError,
	deleteBlockError: state.getBusinessByAliases.deleteBlockError,
	deleteAptError: state.getBusinessByAliases.deleteAptError,

});

const mapDispatchToProps = (dispatch) => (
	bindActionCreators({ getBusinessByAliases, removeFlag, getAllBusinesses, deleteSingleAppointment, defaultnullBlock, defaultnullAppointment, defaultnullBusiness, deleteSingleAppointment, deleteSingleBreak, deleteSingleAvailableSlot, defaultnullSlot }, dispatch)
)

export default connect(mapStateToProps, mapDispatchToProps)(Screen)

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
		justifyContent: 'space-around',
		alignItems: 'center',
	},
	textStyle1: {
		fontFamily: 'open-sans-hebrew-bold',
		fontSize: 11,
		color: '#FFFFFF'
	},
	textStyle2: {
		fontFamily: 'open-sans-hebrew',
		fontSize: 9,
		color: '#FFFFFF'
	},
	textStyle3: {
		fontFamily: 'open-sans-hebrew',
		fontSize: 10,
		color: '#FFFFFF',
		position: 'absolute',
		right: 10
	},
	circle: {
		width: 40,
		height: 40,
		borderRadius: 40 / 2,
		backgroundColor: '#287F7E'
	},
	mediumCircle: {
		width: 34,
		height: 34,
		borderRadius: 34 / 2,
		backgroundColor: '#287F7E'
	},
	smallCircle: {
		width: 30,
		height: 30,
		borderRadius: 30 / 2,
	},
	textStyle8: { fontFamily: 'open-sans-hebrew', fontSize: 20, color: '#000' },
	textStyle5: { fontFamily: 'open-sans-hebrew', fontSize: 16, color: '#555555' },
	textStyle7: { fontFamily: 'open-sans-hebrew', fontSize: 10, color: '#555555' },
	textStyle4: { fontFamily: 'open-sans-hebrew', fontSize: 30, color: '#287F7E' },
	textStyle6: { fontFamily: 'open-sans-hebrew', fontSize: 14, color: '#287F7E' },
	contentTitle: {
		fontSize: 16,
		fontFamily: 'open-sans-hebrew-light',
		color: 'rgba(0,0,0,0.87)'
	},
	textStyle9: {
		fontSize: 11,
		fontFamily: 'open-sans-hebrew-bold',
		color: '#287F7E'
	},
	boxContainer: {
		flex: 7,
		borderLeftWidth: 1,
		borderLeftColor: '#D6D6D6',
		borderTopWidth: 1,
		borderTopColor: '#D6D6D6',
	},
	boxContainerClosedDay: {
		flex: 7,
		borderLeftWidth: 1,
		borderLeftColor: '#D6D6D6',
		borderTopWidth: 1,
		borderTopColor: '#D6D6D6',
		backgroundColor: "#fefefe22"
	},
	rowStyle1: { flex: 1, flexDirection: 'row' },
	rightBorder: {
		flex: 1,
		borderRightColor: '#CCCCCC',
		borderRightWidth: 1
	},
	touchableStyle1: {
		flex: 0,
		width: '100%',
		justifyContent: 'flex-end',
		borderBottomWidth: 1,
		borderBottomColor: '#E5E5E5',
	},
	touchableStyle2: {
		borderWidth: 2,
		borderColor: '#287F7E',
		borderBottomWidth: 2,
		borderBottomColor: '#287F7E',
		opacity: 1,
	},
	touchableStyle3: {
		flex: 0,
		width: '100%',
		justifyContent: 'flex-end',
	},
	touchableStyle4: {
		borderWidth: 2,
		borderColor: '#287F7E',
		opacity: 1,
	},
	smallButtonStyle: {
		backgroundColor: '#FFFFFF',
		width: 40,
		height: 40,
		borderRadius: 40 / 2,
		elevation: 3
	},
	bigButtonStyle: {
		backgroundColor: '#287F7E',
		width: 50,
		height: 50,
		borderRadius: 50 / 2,
		elevation: 3
	},
	NetworkContainter:
	{
		position: 'absolute',
		backgroundColor: '#555555',
		flexDirection: 'row',
		alignItems: 'center',
		left: 0,
		bottom: 0,
		right: 0,
		height: 50,
		paddingLeft: 10,
		paddingRight: 55,
		paddingBottom: 0,
	},
	NetworkMessage:
	{
		color: '#fff',
		fontSize: 14
	},
});