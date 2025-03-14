import React, { useState } from "react";
import { FlatList, TouchableOpacity, View } from "react-native";
import { CartItem } from "../../types/cartItem";
import { Product } from "../../types/product";
import { api } from "../../utils/api";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../Button";
import { MinusCircle } from "../Icons/MinusCircle";
import { PlusCircle } from "../Icons/PlusCircle";
import { OrderConfirmedModal } from "../OrderConfirmedModal";
import { Text } from "../Text";
import { Actions, Image, Item, ProductContainer, QuantityContainer, Summary } from "./styles";

interface CartProps {
  cartItems: Array<CartItem>;
  onAdd(product: Product): void;
  onRemove(product: Product): void;
  onConfirmOrder(): void;
  selectedTable: string;
}

export function Cart({ cartItems, onAdd, onRemove, onConfirmOrder, selectedTable }: CartProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const total = cartItems.reduce((prev, item) => {
    return prev + item.quantity * item.product.price;
  }, 0);

  function handleConfirm() {
    onConfirmOrder();
    setIsModalOpen(false);
  }

  async function handleConfirmOrder() {
    setIsLoading(true);

    await api.post("orders", {
      table: selectedTable,
      products: cartItems.map((cartItem) => ({
        quantity: cartItem.quantity,
        product: cartItem.product._id,
      })),
    });

    setIsLoading(false);
    setIsModalOpen(true);
  }

  return (
    <>
      <OrderConfirmedModal visible={isModalOpen} onConfirm={handleConfirm} />

      {cartItems.length > 0 && (
        <FlatList
          data={cartItems}
          keyExtractor={({ product }) => product._id}
          showsVerticalScrollIndicator={false}
          style={{ marginBottom: 20, maxHeight: 150 }}
          renderItem={({ item: cartItem }) => (
            <Item>
              <ProductContainer>
                <Image
                  source={{
                    uri: `http://192.168.16.130:3001/uploads/${cartItem.product.imagePath}`,
                  }}
                />
                <QuantityContainer>
                  <Text size={14} color="#666">
                    {cartItem.quantity}x
                  </Text>
                </QuantityContainer>
                <View>
                  <Text size={14} weight="600">
                    {cartItem.product.name}
                  </Text>
                  <Text size={14} color="#666" style={{ marginTop: 4 }}>
                    {formatCurrency(cartItem.product.price)}
                  </Text>
                </View>
              </ProductContainer>

              <Actions>
                <TouchableOpacity style={{ marginRight: 24 }} onPress={() => onAdd(cartItem.product)}>
                  <PlusCircle />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => onRemove(cartItem.product)}>
                  <MinusCircle />
                </TouchableOpacity>
              </Actions>
            </Item>
          )}
        />
      )}

      <Summary>
        <View style={{ marginRight: 32, flex: 1 }}>
          {cartItems.length > 0 && (
            <>
              <Text color="#666">Total</Text>
              <Text size={20} weight="600">
                {formatCurrency(total)}
              </Text>
            </>
          )}

          {cartItems.length === 0 && <Text color="#999">O carrinho esta vazio</Text>}
        </View>

        <Button onPress={handleConfirmOrder} disabled={cartItems.length === 0} isLoading={isLoading}>
          Confirmar pedido
        </Button>
      </Summary>
    </>
  );
}
