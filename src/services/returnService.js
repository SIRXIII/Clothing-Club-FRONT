import API from "./api";


export const getAllReturns = () => API.get("/returns");

export const getReturnById = (id) => API.get(`/returns/${id}`);

// export const statusUpdateRefund = (refundId, status) => {
//   return API.post("/refunds/status-update", {
//     id: refundId,
//     status,
//   });
// };