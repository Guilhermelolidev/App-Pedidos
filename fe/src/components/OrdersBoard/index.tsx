import { ReactNode, useState } from "react";
import { toast } from "react-toastify";
import { Order } from "../../types/Order";
import { api } from "../../utils/api";
import { OrderModal } from "../OrderModal";
import { Board, OrdersContainer } from "./styles";

interface OrdersBoardProps {
  icon: ReactNode;
  title: string;
  orders: Order[];
  onCancelOrder: (orderId: string) => Promise<void>;
  onChangeOrderStatus: (
    orderId: string,
    status: Order["status"]
  ) => Promise<void>;
}

export function   OrdersBoard({
  icon,
  title,
  orders,
  onCancelOrder,
  onChangeOrderStatus,
}: OrdersBoardProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  function handleOpenOrder(order: Order) {
    setIsModalVisible(!isModalVisible);
    setSelectedOrder(order);
  }

  function handleCloseModal() {
    setIsModalVisible(false);
    setSelectedOrder(null);
  }

  async function handleOrderStatusChange(orderId: string) {
    setIsLoading(true);
    const status =
      selectedOrder?.status === "WAITING" ? "IN_PRODUCTION" : "DONE";
    await api.patch(`/orders/${orderId}`, { status });
    setIsLoading(false);
    toast.success("Status do pedido alterado com sucesso!");
    handleCloseModal();
    onChangeOrderStatus(orderId, status);
  }

  async function handleDeleteOrder() {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await api.delete(`/orders/${selectedOrder?._id}`);
    setIsLoading(false);
    handleCloseModal();
    onCancelOrder(selectedOrder?._id ?? "");
    toast.success("Pedido removido com sucesso!");
  }

  return (
    <Board>
      <OrderModal
        visible={isModalVisible}
        order={selectedOrder}
        onClose={handleCloseModal}
        onCancelOrder={handleDeleteOrder}
        isLoading={isLoading}
        onOrderStatusChange={handleOrderStatusChange}
      />

      <header>
        <span>{icon}</span>
        <strong>{title}</strong>
        <span>{orders.length}</span>
      </header>

      {orders.length > 0 && (
        <OrdersContainer>
          {orders.map((order) => (
            <button
              type="button"
              onClick={() => handleOpenOrder(order)}
              key={order._id}
            >
              <strong>Mesa {order.table}</strong>
              <span>{order.products.length} itens</span>
            </button>
          ))}
        </OrdersContainer>
      )}
    </Board>
  );
}
