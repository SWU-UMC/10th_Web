export interface LP {
  id: string;
  title: string;
  singer: string;
  price: number;
  image: string;
  amount: number;
}

export interface CartState {
  cartItems: LP[];
  amount: number;
  total: number;
}