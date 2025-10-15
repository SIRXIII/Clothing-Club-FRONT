import { useQuery } from "@tanstack/react-query";
import { getTopTravelers, getTopPartners, getStates, latestNotification } from "../services/dashboardService";

export const useWidgets = () => {
  return useQuery({
    queryKey: ["widgetData"],
    queryFn: getStates,
    select: (res) => res.data,
  });
};




export const useTopTravelers = () => {
  return useQuery({
    queryKey: ["topTravelers"],
    queryFn: getTopTravelers,
    select: (res) => res.data,
  });
};


export const useTopPartners = () => {
  return useQuery({
    queryKey: ["topPartners"],
    queryFn: getTopPartners,
    select: (res) => res.data,
  });
};



export const useLatestNotification = () => {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: latestNotification,
    select: (res) => res.data,
  });
};