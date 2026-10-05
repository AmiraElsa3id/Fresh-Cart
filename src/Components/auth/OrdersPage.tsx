"use client";

import { useUserOrders } from "@/lib/hooks";
import { useAuthStore } from "@/lib/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { Package, Truck, CheckCircle, Clock, XCircle, RotateCcw, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export function OrdersPage() {
  const { user, isLoggedIn } = useAuthStore();
  const { data: orders, isLoading } = useUserOrders(user?.id || "");

  if (!isLoggedIn) {
    return <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>;
  }

  const getStatusConfig = (status: string) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return { label: "Delivered", icon: CheckCircle, color: "bg-green-100 text-green-700", iconColor: "text-green-600" };
      case "shipped":
        return { label: "Shipped", icon: Truck, color: "bg-blue-100 text-blue-700", iconColor: "text-blue-600" };
      case "processing":
        return { label: "Processing", icon: Clock, color: "bg-yellow-100 text-yellow-700", iconColor: "text-yellow-600" };
      case "cancelled":
        return { label: "Cancelled", icon: XCircle, color: "bg-red-100 text-red-700", iconColor: "text-red-600" };
      case "pending":
        return { label: "Pending", icon: Clock, color: "bg-gray-100 text-gray-700", iconColor: "text-gray-600" };
      default:
        return { label: status, icon: Package, color: "bg-gray-100 text-gray-700", iconColor: "text-gray-600" };
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-ink">My Orders</h1>
        <p className="text-slate-500">Track and manage your orders</p>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="w-16 h-16 rounded-lg bg-surface-2" />
                  <div className="flex-1 space-y-3">
                    <div className="h-4 w-3/4 bg-surface-2 rounded" />
                    <div className="h-3 w-1/2 bg-surface-2 rounded" />
                    <div className="h-6 w-24 bg-surface-2 rounded" />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="h-5 w-24 bg-surface-2 rounded-full" />
                    <div className="h-6 w-20 bg-surface-2 rounded" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : orders && orders.length > 0 ? (
        <div className="space-y-6">
          {orders.map((order: any) => {
            const statusConfig = getStatusConfig(order.status);
            const StatusIcon = statusConfig.icon;

            return (
              <Card key={order._id} className="overflow-hidden">
                <CardHeader className="pb-0">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Package className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold text-ink">Order #{order._id?.slice(-8).toUpperCase()}</p>
                        <p className="text-sm text-slate-500">
                          {order.items?.length || 0} items • {new Date(order.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={cn("px-3 py-1.5 text-sm", statusConfig.color)}>
                        <StatusIcon className={cn("w-3.5 h-3.5 mr-1.5", statusConfig.iconColor)} />
                        {statusConfig.label}
                      </Badge>
                      <span className="font-bold text-lg text-primary">{order.totalPrice?.toFixed(2)} EGP</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Separator className="my-4" />
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <h4 className="font-medium text-sm text-slate-500 mb-2">Items</h4>
                      <div className="space-y-3 max-h-48 overflow-y-auto">
                        {order.items?.slice(0, 3).map((item: any, i: number) => (
                          <div key={i} className="flex gap-3">
                            <img
                              src={item.product?.imageCover}
                              alt={item.product?.title}
                              className="w-12 h-12 rounded-lg object-cover"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium line-clamp-1">{item.product?.title}</p>
                              <p className="text-xs text-slate-500">Qty: {item.count}</p>
                              <p className="text-sm text-primary font-medium">
                                {(item.product?.priceAfterDiscount || item.product?.price) * item.count} EGP
                              </p>
                            </div>
                          </div>
                        ))}
                        {order.items && order.items.length > 3 && (
                          <p className="text-sm text-slate-500 text-center py-2">
                            +{order.items.length - 3} more items
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-sm text-slate-500 mb-2">Order Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-slate-500">Order Date</span>
                          <span className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Payment Method</span>
                          <span className="font-medium capitalize">{order.paymentMethod || "Cash on Delivery"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Shipping To</span>
                          <span className="font-medium truncate max-w-[200px]">
                            {order.shippingAddress?.city}, {order.shippingAddress?.details}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-500">Phone</span>
                          <span className="font-medium">{order.shippingAddress?.phone}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Separator className="my-4" />
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <span>Total Paid:</span>
                      <span className="font-bold text-primary text-lg">{order.totalPrice?.toFixed(2)} EGP</span>
                    </div>
                    <Link
                      to={`/orders/${order._id}`}
                      className="flex items-center gap-2 text-primary hover:underline font-medium"
                    >
                      View Details
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <Package className="w-16 h-16 mx-auto mb-4 text-slate-400" />
          <h3 className="text-xl font-semibold text-ink mb-2">No orders yet</h3>
          <p className="text-slate-500 mb-6">Your order history will appear here once you place an order.</p>
          <Link to="/products">
            <Button>Start Shopping</Button>
          </Link>
        </div>
      )}
    </div>
  );
}