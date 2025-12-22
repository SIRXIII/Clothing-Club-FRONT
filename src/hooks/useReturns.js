import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllReturns } from "../services/returnService";



export const useReturns = () => {
  return useQuery({
    queryKey: ["returns"],
    queryFn: getAllReturns,
    select: (res) => res.data.data || [], 
  });
};


// export const useStatusUpdateRefund = () => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: ({ id, status }) => statusUpdateRefund(id, status),
//     onSuccess: () => {
     
//       queryClient.invalidateQueries({ queryKey: ["refunds"] });
//     },
//   });
// };