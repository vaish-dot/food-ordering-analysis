import React, { createContext, useContext, useState, ReactNode } from "react";
import { Order } from "@/types/order";
import { sampleOrders } from "@/data/sampleData";

interface DataContextType {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  loadSampleData: () => void;
}

const DataContext = createContext<DataContextType | null>(null);

export function DataProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>(sampleOrders);

  const loadSampleData = () => setOrders(sampleOrders);

  return (
    <DataContext.Provider value={{ orders, setOrders, loadSampleData }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}
