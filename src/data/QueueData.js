const QueueData = [
  {
    id: "preparing",
    label: "Preparing",
    color: "bg-[#4F46E5]",   
    orders: [
      {
        id: "#1004",
        product: "Silk Kimono (1)",
        customer: "Emily Torres",
        status: "On Time",
        statusColor: "bg-green-100 text-green-600",
      },
      {
        id: "#1012",
        product: "Silk Kimono (1)",
        customer: "Emily Torres",
        status: "<1 hr left",
        statusColor: "bg-yellow-100 text-yellow-600",
      },
    ],
  },
  {
    id: "pickup",
    label: "Pickup",
    color: "bg-[#F59E0B]", 
    orders: [
      {
        id: "#1003",
        product: "Silk Kimono (1)",
        customer: "Emily Torres",
        status: "On Time",
        statusColor: "bg-green-100 text-green-600",
      },
    ],
  },
  {
    id: "delivery",
    label: "Delivery",
    color: "bg-[#22C55E]",  
    orders: [
      {
        id: "#1014",
        product: "Silk Kimono (1)",
        customer: "Emily Torres",
        status: "On Time",
        statusColor: "bg-green-100 text-green-600",
      },
      {
        id: "#1001",
        product: "Silk Kimono (1)",
        customer: "Emily Torres",
        status: "On Time",
        statusColor: "bg-green-100 text-green-600",
      },
    ],
  },
  {
    id: "return",
    label: "Return",
    color: "bg-[#F43F5E]",    
    orders: [
      {
        id: "#1016",
        product: "Silk Kimono (1)",
        customer: "Emily Torres",
        status: "Risk Late",
        statusColor: "bg-orange-100 text-orange-600",
      },
    ],
  },
  {
    id: "cleaning",
    label: "Cleaning",
    color: "bg-[#475569]",   
    orders: [
      {
        id: "#1011",
        product: "Silk Kimono (1)",
        customer: "Emily Torres",
        status: "On Time",
        statusColor: "bg-green-100 text-green-600",
      },
      {
        id: "#1019",
        product: "Silk Kimono (1)",
        customer: "Emily Torres",
        status: "On Time",
        statusColor: "bg-green-100 text-green-600",
      },
    ],
  },
];

export default QueueData;
