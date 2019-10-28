// // import {
// //     GET_BUSINESSES, SUCCESS_GET_BUSINESSES, FAILED_GET_BUSINESSES
// // } from "../actions/GetBusinessesAction";
// import { CREATE_BUSINESS, SUCCESS_CREATE_BUSINESS, FAILED_CREATE_BUSINESS, CREATE_BUSINESS_FROM_CUSTOMER } from '../actions/CreateBusinessAction';

// const initialState = {

//     error: false,
//     isFatching: true,
//     allBusinesses: {},
//     pendingBusiness: null,
//     createBError: null
// }

// const convertArray = (array) =>
//     array.reduce((obj, item) => {
//         obj[item.id] = item
//         return obj
//     }, {});


// const AllBusinessesData = (state = initialState, action) => {
//     switch (action.type) {
//         // case GET_BUSINESSES:
//         //     return {
//         //         ...state,
//         //         isFatching: true
//         //     }
//         // case SUCCESS_GET_BUSINESSES:
//         //     return {
//         //         ...state,
//         //         isFatching: false,
//         //         allBusinesses: convertArray(action.data)
//         //     }
//         // case FAILED_GET_BUSINESSES:
//         //     return {
//         //         ...state,
//         //         isFatching: false,
//         //         error: true
//         //     }

//         case CREATE_BUSINESS:
//             return {
//                 ...state,
//             }

//         //create Business
//         case SUCCESS_CREATE_BUSINESS:
//             return {
//                 ...state,
//                 pendingBusiness: true,
//                 createBError: false,
//             }
//         case FAILED_CREATE_BUSINESS:
//             return {
//                 ...state,
//                 createBError: true
//             }
//         //add business from socket
//         case CREATE_BUSINESS_FROM_CUSTOMER:
//             console.log(action.data.body.business)
//             const business = action.data.body.business
//             return {
//                 ...state,
//                 pendingBusiness: false,
//                 allBusinesses: { ...state.allBusinesses, [business.id]: business }

//             }

//         default:
//             return state;
//     }
// }
// export default AllBusinessesData;