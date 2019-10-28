import { GET_BUSINESS_BY_ALIASES, SUCCESS_GET_BUSINESS_BY_ALIASES, FAILED_GET_BUSINESS_BY_ALIASES } from "../actions/GetBusinessByAliases";
import { CREATE_CUSTOMER, SUCCESS_CREATE_CUSTOMER, FAILED_CREATE_CUSTOMER, DEFAULT_NULL_CUSTOMER } from '../actions/CreateCustomerAction';
import { CREATE_EMPLOYEE, SUCCESS_CREATE_EMPLOYEE, FAILED_CREATE_EMPLOYEE, DEFAULT_NULL_EMPLOYEE } from "../actions/CreateEmployeeAction";
import { CREATE_SERVICE, SUCCESS_CREATE_SERVICE, FAILED_CREATE_SERVICE, DEFAULT_NULL_SERVICE } from '../actions/CreateServiceAction';
import { CREATE_CUSTOMER_FROM_SOCKET, CREATE_EMPLOYEE_FROM_SOCKET, CREATE_SERVICE_FROM_SOCKET, CREATE_BUSY_BLOCK_FROM_SOCKET, CREATE_AVAILABILITY_SLOT_FROM_SOCKET, CREATE_APPOINTMENT_FROM_SCOCKET, DELETE_CUSTOMER_FROM_SOCKET, DELETE_EMPLOYEE_FROM_SOCKET, CHANGE_OPENING_HOURS_FROM_SOCKET, DELETE_APPOINTMENT_FROM_SOCKET, DELETE_BUSY_BLOCK_FROM_SOCKET, DELETE_AVIALABLE_SLOT_FROM_SOCKET } from "../actions/SocketAction";
import { DELETE_CUSTOMER_ID, SUCCESS_DELETE_CUSTOMER_ID, FAILED_DELETE_CUSTOMER_ID } from '../actions/DeleteCustomerAction';
import { DELETE_EMPLOYEE, SUCCESS_DELETE_EMPLOYEE, FAILED_DELETE_EMPLOYEE } from '../actions/DeleteEmployeeAction';
import { CREATE_BLOCKS, SUCCESS_CREATE_BLOCKS, FAILED_CREATE_BLOCKS, DEFAULT_NULL_BLOCK } from "../actions/CreateBusyBlocksAction";
import { CREATE_SLOTS, SUCCESS_CREATE_SLOTS, FAILED_CREATE_SLOTS, DEFAULT_NULL_SLOT } from "../actions/CreateAvailabilitySlotsAction";
import { GET_TIME, SUCCESS_GET_TIME, FAILED_GET_TIME } from "../actions/getTimeSuggestionAction";
import { CREATE_APPOINTMENT, SUCCESS_CREATE_APPOINTMENT, FAILED_CREATE_APPOINTMENT, DEFAULT_NULL_APPOINTMENT } from "../actions/CreateAppointmentAction";
import { SET_OPENING_HOURS, SUCCESS_SET_OPENING_HOURS, FAILED_SET_OPENING_HOURS, DEFAULT_NULL_OPENINGHOURS } from '../actions/SetOpeningHoursAction';
import { SET_POFILE_IMAGE, SUCCESS_SET_POFILE_IMAGE, FAILED_SET_POFILE_IMAGE, DEFAULT_NULL_POFILE_IMAGE } from "../actions/SetProfileImageAction"
import {
    GET_BUSINESSES, SUCCESS_GET_BUSINESSES, FAILED_GET_BUSINESSES
} from "../actions/GetBusinessesAction";
import { CREATE_BUSINESS, SUCCESS_CREATE_BUSINESS, FAILED_CREATE_BUSINESS, CREATE_BUSINESS_FROM_CUSTOMER, DEFAULT_NULL_BUSINESS } from '../actions/CreateBusinessAction';
import { LOGOUT, SUCCESS_LOGOUT, FAILED_LOGOUT } from "../actions/LogoutAction";
import { REMOVE_FLAG_FROM_BUSINESS } from "../actions/BusinessCreationFalseAction";
import { DELETE_APPOINTMENT_ID, SUCCESS_DELETE_APPOINTMENT_ID, FAILED_DELETE_APPOINTMENT_ID } from '../actions/DeleteAppointmentAction';
import { DELETE_BREAK_ID, SUCCESS_DELETE_BREAK_ID, FAILED_DELETE_BREAK_ID } from '../actions/DeleteBreakAction';
import { DELETE_AVAILABLE_SLOT_ID, SUCCESS_DELETE_AVAILABLE_SLOT_ID, FAILED_DELETE_AVAILABLE_SLOT_ID } from '../actions/DeleteAvailableSlotAction';
const initialState = {
    //items: [],
    //error: false,
    isFatching: false,
    id: null,
    events: [],
    customers: {},
    employees: {},
    services: {},
    appointment: {},
    opening_hours: {},
    ProfileImage: {},
    getTimeSuggestions: null,
    pendingCustomer: null,
    pendingDeleteCustomer: null,
    pendingEmployee: null,
    pendingService: null,
    pendingBusyBlock: null,
    pendingAvailabilitySlot: null,
    pendingDeleteAppointment: null,
    pendingDeleteBusyBlock: null,
    pendingDeleteAvailableSlot: null,
    createCError: null,
    deleteCError: null,
    createEError: null,
    deleteEError: null,
    createSError: null,
    deleteAptError: null,
    deleteBlockError: null,
    deleteAvailableSlotError: null,
    pendingAppointment: null,
    pendingOpeningHours: null,
    createAppError: null,
    createBError: null,
    createASError: null,
    changeHoursError: null,
    getTimeError: false,
    allBusinesses: {},
    pendingBusiness: null,
    createBlockError: null,
    ProfileImageError: null,
    pendingProfileImage: null,

}


const convertArrayToObject = (array) =>
    array.reduce((obj, item) => {
        obj[item.user.id] = item
        return obj
    }, {});

const convertServiceArray = (array) =>
    array.reduce((obj, item) => {
        obj[item.id] = item
        return obj
    }, {});

const convertArray = (array) =>
    array.reduce((obj, item) => {
        obj[item.id] = item
        return obj
    }, {});


const convertTimeSuggestions = (responseData) => {

    var newoBj = responseData;
    var newUtcArray = [];
    var mainArray = [];

    for (var key in newoBj) {
        // getting array of events from each employee
        var outer, tempdate, inner, savekey;
        for (outer = 0; outer < newoBj[key].length; outer++) {
            tempdate = new Date(newoBj[key][outer].start_time)
            // console.warn('tempdate', tempdate)
            savekey = key;
            if (newUtcArray === [])
                newUtcArray.push({ date: tempdate, employee: key })
            else {
                var checkindex = -1, dateItem;
                for (inner = 0; inner < newUtcArray.length; inner++) {
                    dateItem = new Date(newUtcArray[inner].tempdate);
                    if (tempdate < dateItem) {
                        checkindex = inner;
                        break;
                    }
                    else
                        continue;
                }

                if (checkindex === -1)
                    newUtcArray.push({ date: tempdate, employee: key })
                else
                    newUtcArray.splice(checkindex, 0, { date: tempdate, employee: key })
            }
        }

    }

    // console.warn('new array', newUtcArray);
    //removing the dupliate 
    return makekeyvalue(newUtcArray);
};

const makekeyvalue = (newUtcArray) => {

    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var resObj = {}, tempdate, convDate, tempTime, intime;

    newUtcArray.map((item, index) => {

        tempdate = new Date(item.date)
        // console.warn(monthNames[tempdate.getMonth()])
        convDate = tempdate.getDate() + " " + monthNames[tempdate.getMonth()] + " " + tempdate.getFullYear()
        // console.warn(convDate)
        if (resObj[convDate] === undefined) {
            Object.assign(resObj, {
                [convDate]: { [tempdate]: [item.employee] }

            })
        }
        else {
            tempTime = tempdate
            if (resObj[convDate].hasOwnProperty(tempTime)) {
                intime = resObj[convDate]
                intime[tempTime].push(item.employee)
            }
            else {
                intime = resObj[convDate]
                intime[tempTime] = [item.employee]
            }
        }


    })
    return resObj;
}

const BusinessByAliasesData = (state = initialState, action) => {

    switch (action.type) {

        case GET_BUSINESSES:
            return {
                ...state,
            }
        case SUCCESS_GET_BUSINESSES:
            return {
                ...state,
                allBusinesses: convertArray(action.data)
            }
        case FAILED_GET_BUSINESSES:
            return {
                ...state,
            }

        //create Business
        case SUCCESS_CREATE_BUSINESS:
            return {
                ...state,
                pendingBusiness: true,
                createBError: false,
            }
        case FAILED_CREATE_BUSINESS:
            return {
                ...state,
                createBError: true
            }
        case DEFAULT_NULL_BUSINESS:
            console.log("default null BUSINESS")
            return {
                ...state,
                pendingBusiness: null,
                createBError: null,
                //deleteCError: null
            }
        //add business from socket
        case CREATE_BUSINESS_FROM_CUSTOMER:
            //console.log(action.data.body.business)
            const business = action.data.body.business
            business.newlyCreated = true;
            return {
                ...state,
                pendingBusiness: false,
                allBusinesses: { ...state.allBusinesses, [business.id]: business }

            }
        case REMOVE_FLAG_FROM_BUSINESS:
            console.log("REMOVE_FLAG_FROM_BUSINESS")
            const newBusiness = action.data;
            console.log("REMOVE_FLAG_FROM_BUSINESS 2", newBusiness)
            newBusiness.newlyCreated = false;
            console.log("REMOVE_FLAG_FROM_BUSINESS 2", newBusiness)
            return {
                allBusinesses: { ...state.allBusinesses, [newBusiness.id]: newBusiness }
            }

        case GET_BUSINESS_BY_ALIASES:
            return {
                ...state,
                isFatching: true
            }
        case SUCCESS_GET_BUSINESS_BY_ALIASES:
            //console.log("event", action.data.events)
            return {
                ...state,
                isFatching: false,
                items: action.data,
                bId: action.data.business.id,
                customers: convertArrayToObject(action.data.business.customers),
                employees: convertArrayToObject(action.data.business.employees),
                services: convertServiceArray(action.data.business.services),
                appointment: action.data.activity,
                opening_hours: action.data.business.settings.opening_hours,
                timezone: action.data.business.timezone,
                businessName: action.data.business.name,
                events: action.data.events
            }
        case FAILED_GET_BUSINESS_BY_ALIASES:
            return {
                ...state,
                isFatching: false,
                // error: true
            }

        //Create Customer
        case CREATE_CUSTOMER:
            console.log("create")
            return {
                ...state,
            }
        case SUCCESS_CREATE_CUSTOMER:
            console.log("created")
            return {
                ...state,
                pendingCustomer: true,
                createCError: false,

            }
        case FAILED_CREATE_CUSTOMER:
            console.log("fail")
            console.log("ErrrorCUST while creating")
            return {
                ...state,
                createCError: true
            }
        case DEFAULT_NULL_CUSTOMER:
            console.log("default null")
            return {
                ...state,
                pendingCustomer: null,
                createCError: null,
                deleteCError: null
            }

        //Delete Customer
        case DELETE_CUSTOMER_ID:
            return {
                ...state,
            }
        case SUCCESS_DELETE_CUSTOMER_ID:
            console.log("Detete Succesfully inReducer")
            return {
                ...state,
                pendingDeleteCustomer: true,
                deleteCError: false,
            }
        case FAILED_DELETE_CUSTOMER_ID:
            console.log("Error while deleting in reducer")
            return {
                ...state,
                deleteCError: true
            }

        //Add Customer From Socket
        case CREATE_CUSTOMER_FROM_SOCKET:
            {
                const businessId = action.data.body.business_id
                const customer = action.data.body.customer

                return {
                    ...state,
                    pendingCustomer: false,
                    customers: { ...state.customers, [customer.user.id]: customer }
                }
            }
        //Delete Customer From Socket
        case DELETE_CUSTOMER_FROM_SOCKET:
            console.log("delete successfuuly in reducer")
            {
                const customer_id = action.data.body.customer_id;
                const customers = { ...state.customers };
                delete customers[customer_id];
                return { ...state, customers }

            }

        //Create Employee
        case CREATE_EMPLOYEE:
            return {
                ...state,
            }
        case SUCCESS_CREATE_EMPLOYEE:
            return {
                ...state,
                pendingEmployee: true,
                createEError: false
            }
        case FAILED_CREATE_EMPLOYEE:
            return {
                ...state,
                createEError: true,
            }
        case DEFAULT_NULL_EMPLOYEE:
            console.log("default null")
            return {
                ...state,
                pendingEmployee: null,
                createEError: null,
                deleteEError: null
            }

        //Delete Employee

        case DELETE_EMPLOYEE:
            return {
                ...state,
            }
        case SUCCESS_DELETE_EMPLOYEE:
            return {
                ...state,
                pendingDeleteEmployee: true,
                deleteEError: false,
            }
        case FAILED_DELETE_EMPLOYEE:
            return {
                ...state,
                deleteEError: true,
            }


        //Add Employee from Socket
        case CREATE_EMPLOYEE_FROM_SOCKET:
            {
                const businessId = action.data.body.business_id
                const employee = action.data.body.employee
                return {
                    ...state,
                    pendingEmployee: false,
                    //employees: [...state.employees, employee],
                    employees: { ...state.employees, [employee.user.id]: employee }

                }

            }
        //Delete Customer From Socket
        case DELETE_EMPLOYEE_FROM_SOCKET:
            {
                const employee_id = action.data.body.employee_id;
                const employees = { ...state.employees }
                delete employees[employee_id];
                return { ...state, employees }
                // return {
                //     ...state,
                //     employees: state.employees.filter(data => data.user.id !== employee_id)
                // }

            }


        //Create Service
        case CREATE_SERVICE:
            return {
                ...state,
            }

        case SUCCESS_CREATE_SERVICE:
            return {
                ...state,
                pendingService: true,
                createSError: false

            }

        case FAILED_CREATE_SERVICE:
            return {
                ...state,
                createSError: true
            }

        case DEFAULT_NULL_SERVICE:
            return {
                ...state,
                pendingService: null,
                createSError: null,

            }

        //Add Service from Socket
        case CREATE_SERVICE_FROM_SOCKET:
            {
                const businessId = action.data.body.business_id
                const service = action.data.body.service
                return {
                    ...state,
                    pendingService: false,
                    services: { ...state.services, [service.id]: service }
                }

            }


        //Create Busy Block
        case CREATE_BLOCKS:
            return {
                ...state,
            }

        case SUCCESS_CREATE_BLOCKS:
            return {
                ...state,
                pendingBusyBlock: true,
                createBlockError: false
            }

        case FAILED_CREATE_BLOCKS:
            return {
                ...state,
                createBlockError: true
            }
        case DEFAULT_NULL_BLOCK:
            console.log("default null BLOCK")
            return {
                ...state,
                pendingBusyBlock: null,
                createBlockError: null,
                deleteBlockError: null
            }

        //Add Busy block from socket
        case CREATE_BUSY_BLOCK_FROM_SOCKET:
            {
                const busy_block = action.data.body.busy_block
                console.log("block reducer", busy_block)
                return {
                    ...state,
                    pendingBusyBlock: false,
                    events: [...state.events, busy_block]
                }
            }

        //create slots
        case CREATE_SLOTS:
            return {
                ...state,
            }

        case SUCCESS_CREATE_SLOTS:
            return {
                ...state,
                pendingAvailabilitySlot: true,
                createASError: false,
            }

        case FAILED_CREATE_SLOTS:
            return {
                ...state,
                createASError: true
            }
        case DEFAULT_NULL_SLOT:
            console.log("default null Slot")
            return {
                ...state,
                pendingAvailabilitySlot: null,
                createASError: null,
                //deleteASError: null
            }

        //Add slot from socket
        case CREATE_AVAILABILITY_SLOT_FROM_SOCKET:
            {
                const availability_slot = action.data.body.availability_slot
                console.log("availability_slot reducer", availability_slot)
                return {
                    ...state,
                    pendingAvailabilitySlot: false,
                    events: [...state.events, availability_slot]

                }
            }

        //Add Appointment from socket
        case CREATE_APPOINTMENT_FROM_SCOCKET:
            {
                const appointment = action.data.body.appointment
                console.log("appointment reducer", appointment)
                return {
                    ...state,
                    pendingAppointment: false,
                    events: [...state.events, appointment]
                }
            }

        //get time suggestions
        case GET_TIME:
            return {
                ...state,
            }
        case SUCCESS_GET_TIME:
            return {
                ...state,
                getTimeSuggestions: convertTimeSuggestions(action.data),

                getTimeError: false,
            }
        case FAILED_GET_TIME:
            return {
                ...state,
                getTimeError: true
            }

        //appointment

        case CREATE_APPOINTMENT:
            return {
                ...state,
            }

        case SUCCESS_CREATE_APPOINTMENT:
            return {
                ...state,
                pendingAppointment: true,
                createAppError: false

            }

        case FAILED_CREATE_APPOINTMENT:
            return {
                ...state,
                createAppError: true
            }

        case DEFAULT_NULL_APPOINTMENT:
            console.log("default null appointment")
            return {
                ...state,
                pendingAppointment: null,
                createAppError: null,
                deleteAptError: null
            }


        //Delete Appointment
        case DELETE_APPOINTMENT_ID:
            return {
                ...state,
            }
        case SUCCESS_DELETE_APPOINTMENT_ID:
            console.log("Detete Succesfully APPOINTMENT ")
            return {
                ...state,
                pendingDeleteAppointment: true,
                deleteAptError: false,
            }
        case FAILED_DELETE_APPOINTMENT_ID:
            console.log("Error while deleting APPOINTMENT in")
            return {
                ...state,
                deleteAptError: true
            }

        // Delete Appoinment From Socket
        case DELETE_APPOINTMENT_FROM_SOCKET:
            console.log("1111AAASOCKET delete successfuuly in Socket", action.data)
            {
                const appointment_id = action.data.body.appointment_id;
                const events = [...state.events];
                // console.log("EVENTSS", events)
                var indexVar = -1;

                events.map((e, index) => {
                    console.log("id JBKJBOLJNLJKN", e.id);
                    if (appointment_id === e.id) {
                        console.log("equal11")
                        indexVar = index
                        //console.log("equal11")
                    }
                })

                console.warn("SHOW ME INDEX TARGTET", indexVar, appointment_id)
                console.log("checking", events[indexVar].id)
                events.splice(indexVar, 1)
                // const events = state.events.map(e => {
                //     console.log("APPOINTMENTID", e.id)
                // })
                // //delete events[appointment_id];
                return { ...state, events }

            }


        //Delete Break
        case DELETE_BREAK_ID:
            return {
                ...state,
            }
        case SUCCESS_DELETE_BREAK_ID:
            console.log("Detete Succesfully BREAK inReducer")
            return {
                ...state,
                pendingDeleteBusyBlock: true,
                deleteBlockError: false,
            }
        case FAILED_DELETE_BREAK_ID:
            console.log("Error while deleting BREAK in reducer")
            return {
                ...state,
                deleteBlockError: true
            }

        //Delete Busy block From Socket
        case DELETE_BUSY_BLOCK_FROM_SOCKET:
            console.log("delete successfuuly in reducer SOCKET")
            {
                const busy_block_id = action.data.body.busy_block_id;
                console.log("busy_block_id", busy_block_id)
                //         const appointments = { ...state.appointments };
                //         delete appointments[appointment_id];
                //         console.log("DELETEAPPO", delete appointments[appointment_id])
                //         return { ...state, appointments }

            }


        //Delete AVAILALBE
        case DELETE_AVAILABLE_SLOT_ID:
            return {
                ...state,
            }
        case SUCCESS_DELETE_AVAILABLE_SLOT_ID:
            console.log("Detete Succesfully AVAILABLE SLOT inReducer")
            return {
                ...state,
                pendingDeleteAvailableSlot: true,
                deleteAvailableSlotError: false,
            }
        case FAILED_DELETE_AVAILABLE_SLOT_ID:
            console.log("Error while deleting AVAILABLE SLOT in reducer")
            return {
                ...state,
                deleteAvailableSlotError: true
            }
        //Delete AVAILALBE SLOTS From Socket
        case DELETE_AVIALABLE_SLOT_FROM_SOCKET:
            console.log("delete successfuuly in reducer SOCKET")

            {
                const availability_slot_id = action.data.body.availability_slot_id;
                console.log("availability_slot_id", availability_slot_id)

                const events = [...state.events];
                // console.log("EVENTSS", events)
                var indexVar = -1;

                events.map((e, index) => {
                    console.log("id JBKJBOLJNLJKN", e.id);
                    if (availability_slot_id === e.id) {
                        console.log("equal11")
                        indexVar = index
                        //console.log("equal11")
                    }
                })

                console.warn("SHOW ME INDEX TARGTET", indexVar, availability_slot_id)
                console.log("checking", events[indexVar].id)
                events.splice(indexVar, 1)
                // const events = state.events.map(e => {
                //     console.log("APPOINTMENTID", e.id)
                // })
                // //delete events[appointment_id];
                return { ...state, events }

            }



        //update opening hours
        case SET_OPENING_HOURS:
            return {
                ...state,
            }

        case SUCCESS_SET_OPENING_HOURS:
            return {
                ...state,
                pendingOpeningHours: true,
                changeHoursError: false,
            }

        case FAILED_SET_OPENING_HOURS:
            return {
                ...state,
                changeHoursError: true
            }

        case DEFAULT_NULL_OPENINGHOURS:
            return {
                ...state,
                changeHoursError: null,
                pendingOpeningHours: null,

            }

        //update opening hrs from socket
        case CHANGE_OPENING_HOURS_FROM_SOCKET:
            {
                const opening_hrs = action.data.body.opening_hours
                return {
                    ...state,
                    opening_hours: opening_hrs
                }
            }

        //Update ProfileImge
        case SET_POFILE_IMAGE:
            return {
                ...state,
            }

        case SUCCESS_SET_POFILE_IMAGE:
            return {
                ...state,
                pendingProfileImage: true,
                ProfileImageError: false,
            }

        case FAILED_SET_POFILE_IMAGE:
            return {
                ...state,
                ProfileImageError: true
            }

        case DEFAULT_NULL_POFILE_IMAGE:
            return {
                ...state,
                ProfileImageError: null,
                pendingProfileImage: null,

            }


        case LOGOUT:
            {
                return state;
            }
        case SUCCESS_LOGOUT:
            {
                console.log("reducer logout")
                //AsyncStorage.clear()
                return {
                    isFatching: false,
                    id: null,
                    events: [],
                    customers: {},
                    employees: {},
                    services: {},
                    appointment: {},
                    opening_hours: {},
                    ProfileImage: {},
                    getTimeSuggestions: null,
                    pendingCustomer: null,
                    pendingDeleteCustomer: null,
                    pendingEmployee: null,
                    pendingService: null,
                    pendingBusyBlock: null,
                    pendingAvailabilitySlot: null,
                    createCError: null,
                    deleteCError: null,
                    createEError: null,
                    deleteEError: null,
                    createSError: null,
                    pendingAppointment: null,
                    pendingOpeningHours: false,
                    createAppError: null,
                    createBError: null,
                    createASError: null,
                    changeHoursError: false,
                    getTimeError: false,
                    allBusinesses: {},
                    pendingBusiness: null,
                    createBlockError: null,
                    ProfileImageError: null,
                    pendingProfileImage: null,

                }

            }
        case FAILED_LOGOUT:
            {
                //return
            }

        default:
            return state;
    }
}
export default BusinessByAliasesData;