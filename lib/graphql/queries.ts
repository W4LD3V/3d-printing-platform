import { gql } from '@apollo/client';

export const ME_QUERY = gql`
  query Me {
    me { id name email role }
  }
`;

export const PLASTICS_QUERY = gql`
  query Plastics { plastics { id name description pricePerGram active } }
`;

export const COLORS_QUERY = gql`
  query Colors { colors { id name hex available } }
`;

export const MY_ORDERS_QUERY = gql`
  query MyOrders {
    myOrders {
      id
      modelUrl
      notes
      status
      userHidden
      createdAt
      material { id name pricePerGram }
      color { id name hex }
      user { id email }
    }
  }
`;

export const ALL_ORDERS_QUERY = gql`
  query Orders {
    orders {
      id
      modelUrl
      notes
      status
      userHidden
      createdAt
      user { id email }
      material { id name }
      color { id name hex }
    }
  }
`;

export const CREATE_ORDER_MUTATION = gql`
  mutation CreateOrder($input: OrderInput!) {
    createOrder(input: $input) {
      id
      modelUrl
      status
      material { name }
      color { name }
      createdAt
    }
  }
`;

export const UPDATE_ORDER_STATUS_MUTATION = gql`
  mutation UpdateOrderStatus($id: ID!, $status: String!) {
    updateOrderStatus(id: $id, status: $status) { id status }
  }
`;

export const ADD_PLASTIC_MUTATION = gql`
  mutation AddPlastic($input: PlasticInput!) {
    addPlastic(input: $input) { id name pricePerGram active }
  }
`;

export const UPDATE_PLASTIC_MUTATION = gql`
  mutation UpdatePlastic($id: ID!, $input: PlasticInput!) {
    updatePlastic(id: $id, input: $input) { id name pricePerGram active }
  }
`;

export const DELETE_PLASTIC_MUTATION = gql`
  mutation DeletePlastic($id: ID!) {
    deletePlastic(id: $id)
  }
`;

export const ADD_COLOR_MUTATION = gql`
  mutation AddColor($input: ColorInput!) { addColor(input: $input) { id name hex available } }
`;

export const UPDATE_COLOR_MUTATION = gql`
  mutation UpdateColor($id: ID!, $input: ColorInput!) { updateColor(id: $id, input: $input) { id name hex available } }
`;

export const DELETE_COLOR_MUTATION = gql`
  mutation DeleteColor($id: ID!) { deleteColor(id: $id) }
`;

export const DELETE_ORDER_MUTATION = gql`
  mutation DeleteOrder($id: ID!) { deleteOrder(id: $id) }
`;
