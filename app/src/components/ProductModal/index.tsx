import { StatusBar } from "expo-status-bar";
import React from "react";
import { FlatList, Modal, View } from "react-native";
import { Product } from "../../types/product";
import { formatCurrency } from "../../utils/formatCurrency";
import { Button } from "../Button";
import { Close } from "../Icons/Close";
import { Text } from "../Text";
import { CloseButton, Footer, FooterContainer, Image, Ingredient, IngredientsContainer, ModalBody } from "./styles";

interface ProductModalProps {
  visible: boolean;
  onClose(): void;
  product: Product | null;
  onAddToCart(product: Product): void;
}

export function ProductModal({ visible, product, onClose, onAddToCart }: ProductModalProps) {
  if (!product) return null;

  function handleAddToCart(product: Product) {
    onAddToCart(product);
    onClose();
  }

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide" presentationStyle="pageSheet">
      <StatusBar hidden={true} />

      <Image
        source={{
          uri: `http://192.168.16.130:3001/uploads/${product.imagePath}`,
        }}
      >
        <CloseButton onPress={onClose}>
          <Close />
        </CloseButton>
      </Image>

      <ModalBody>
        <View>
          <Text size={24} weight="600">
            {product.name}
          </Text>
          <Text color="#666" style={{ marginTop: 8 }}>
            {product.description}
          </Text>
        </View>

        {product.ingredients.length > 0 && (
          <IngredientsContainer>
            <Text color="#666" weight="600">
              Ingredientes
            </Text>

            <FlatList
              data={product.ingredients}
              keyExtractor={({ _id }) => _id}
              showsVerticalScrollIndicator={false}
              style={{ marginTop: 16 }}
              renderItem={({ item: ingredient }) => (
                <Ingredient>
                  <Text>{ingredient.icon}</Text>
                  <Text size={14} color="#666" style={{ marginLeft: 20 }}>
                    {ingredient.name}
                  </Text>
                </Ingredient>
              )}
            />
          </IngredientsContainer>
        )}
      </ModalBody>

      <Footer>
        <FooterContainer>
          <View>
            <Text color="#666">Preço</Text>
            <Text size={20} weight="600">
              {formatCurrency(product.price)}
            </Text>
          </View>

          <Button onPress={() => handleAddToCart(product)}>Adicionar ao pedido</Button>
        </FooterContainer>
      </Footer>
    </Modal>
  );
}
