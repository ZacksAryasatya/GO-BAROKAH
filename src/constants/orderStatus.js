import { CheckCircle2, Clock, Truck, XCircle, Package } from 'lucide-react';

export const ORDER_STATUS_CONFIG = {
  completed: {
    label: "Selesai",
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    icon: CheckCircle2
  },
  processing: {
    label: "Diproses",
    color: "bg-blue-50 text-blue-700 border-blue-100",
    icon: Package
  },
  pending: {
    label: "Menunggu",
    color: "bg-amber-50 text-amber-700 border-amber-100",
    icon: Clock
  },
  shipping: {
    label: "Dikirim",
    color: "bg-purple-50 text-purple-700 border-purple-100",
    icon: Truck
  },
  cancelled: {
    label: "Dibatalkan",
    color: "bg-red-50 text-red-700 border-red-100",
    icon: XCircle
  }
};