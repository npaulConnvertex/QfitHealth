import { combineReducers } from "redux";
//import AllBusinessesData from "../reducers/GetBusinessesReducer";
//import CreateBusinessReducer from "../reducers/CreateBusinessReducer";
//import CreateEmployeeReducer from "../reducers/CreateEmployeeReducer";
import getBusinessByAliases from "../reducers/GetBusinessByAliasesReducer";
// import getBusinessByAliases from "../reducers/GetBusinessByAliasesReducer"
//import CreateServiceReducer from '../reducers/CreateServiceReducer';
// import CreateCustomerReducer from "../reducers/CreateCustomerReducer";
// import CreateSlotsReducer from "../reducers/CreateAvailabilitySlotReducer";
// import CreateBlocksReducer from '../reducers/CreateBusyBlocksReducer';
//import DeleteCustomerReducer from "../reducers/DeleteCustomerReducer";
// import SetOpeningHoursReducer from "../reducers/SetOpeningHoursReducer";
// import DeleteEmployeeReducer from "../reducers/DeleteEmployeeReducer";

const rootReducer = combineReducers({
    //AllBusinessesData,
    //CreateBusinessReducer,
    //CreateEmployeeReducer,
    getBusinessByAliases,
    //CreateServiceReducer,
    // CreateCustomerReducer,
    // CreateSlotsReducer,
    // CreateBlocksReducer,
    //DeleteCustomerReducer,
    // DeleteEmployeeReducer,
    // SetOpeningHoursReducer,
})

export default rootReducer;