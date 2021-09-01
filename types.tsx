/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { CompositeScreenProps, NavigatorScreenParams } from '@react-navigation/native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList { }
  }
}

export type RootStackParamList = {
  Root: NavigatorScreenParams<RootTabParamList> | undefined;
  Modal: undefined;
  OrderDetails: undefined;
  NotFound: undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  Screen
>;

export type RootTabParamList = {
  TabOne: undefined;
  TabTwo: undefined;
  DineIn: undefined;
  TakeAway: undefined;
  Delivery: undefined;
};

export type RootTabScreenProps<Screen extends keyof RootTabParamList> = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, Screen>,
  NativeStackScreenProps<RootStackParamList>
>;
export type Order = {
  Id: number
  AggregatorOrderId: number
  AllItemDisc: number
  AllItemTaxDisc: number
  AllItemTotalDisc: number
  BillAmount: number
  BillDate: string
  BillDateTime: string
  BillStatusId: number
  ChargeJson: string
  Charges: number
  Closed: boolean
  CompanyId: number
  CustomerAddressId: number
  CustomerData: string
  CustomerId: number
  CustomerDetails: CustomerDetails
  DeliveryDateTime: string
  DiningTableId: number
  DiscAmount: number
  DiscPercent: number
  DiscType: number
  FoodReady: boolean
  InvoiceNo: string
  IsAdvanceOrder: boolean
  ItemJson: string
  Items: Array<OrderItem>
  KOTS: Array<KOT>
  ModifiedDate: string
  Note: string
  OrderDiscount: number
  OrderedDate: string
  OrderedDateTime: string
  OrderJson: string
  OrderNo: number
  OrderId: number
  OrderStatusDetails: string
  OrderStatusId: number
  OrderTaxDisc: number
  OrderTotDisc: number
  OrderTypeId: number
  OrderName: string
  PaidAmount: number
  PreviousStatusId: number
  RefundAmount: number
  RiderStatusDetails: string
  Source: string
  SourceId: number
  SplitTableId: number
  StorePaymentTypeId: number
  PaymentTypeId: number
  StoreId: number
  Tax1: number
  Tax2: number
  Tax3: number
  UPOrderId: number
  UserId: number
  WaiterId: number
  TaxAmount: number
  additionalchargearray: Array<AdditionalCharge>
  subtotal: number
  extra: number
  events: Array<any>
  datastatus: string
  status: string
  Transactions: Array<Transaction>
  istaxinclusive: boolean
  changeditems: Array<string>
  diningtablekey: string
  isordersaved: boolean
  deliverytimestamp: number
  DeliveryStoreId: number
  createdtimestamp: number
  deliveryclicked: boolean
  alltransactions: any
  appversion: string
}

export type KOT = {

}

export type OrderItem = {
  Id: number
  CategoryId: number
  ComplementryQty: number
  DiscAmount: number
  DiscPercent: number
  DiscType: number
  Extra: number
  FreeQtyPercentage: number
  ItemDiscount: number
  KitchenUserId: number
  KOTGroupId: number
  KOTId: number
  Message: string
  MinimumQty: number
  Note: string
  OptionJson: string
  OptionGroup: Array<OptionGroup>
  OrderDiscount: number
  OrderId: number
  Price: number
  ProductId: number
  ProductKey: string
  Name: string
  Quantity: number
  StatusId: number
  tax1_p: number
  tax2_p: number
  tax3_p: number
  Tax1: number
  Tax2: number
  Tax3: number
  TaxGroupId: number
  TaxItemDiscount: number
  TaxOrderDiscount: number
  TotalAmount: number
  TaxAmount1: number
  TaxAmount2: number
  TaxAmount3: number
  TaxAmount: number
  IsTaxInclusive: boolean
  Product: string
  showname: string
  isorderitem: boolean
  kotquantity: number
  baseprice: number
  kotrefid: string
  refid: string
}

export type OptionGroup = {
  Id: number
  Name: string
  OptionGroupType: number
  Option: Array<Option>
  MinimumSelectable: number
  MaximumSelectable: number
  SortOrder: number
  selected: boolean
}

export type Option = {
  Id: number
  DeliveryPrice: number
  Name: string
  Price: number
  selected: number
  TakeawayPrice: number
  orderitemrefid: string
  IsSingleQtyOption: boolean
}

export type AdditionalCharge = {
  Id: number
  Amount: number
  ChargeType: number
  ChargeValue: number
  Description: string
  TaxGroupId: number
  selected: boolean
}

export type CustomerDetails = {
  Id: number
  Name: string
  Email: string
  PhoneNo: string
  Address: string
  City: string
  PostalCode: number
  googlemapurl: string
  CompanyId: number
  StoreId: number
  Sync: number
  val: number
}

export type Transaction = {
  Id: number
  Amount: number
  OrderId: number
  CustomerId: number
  PaymentTypeId: number
  StorePaymentTypeId: number
  TranstypeId: number
  PaymentStatusId: number
  TransDateTime: string
  TransDate: string
  UserId: number
  CompanyId: number
  StoreId: number
  Notes: string
  Remaining: number
  InvoiceNo: string
  StorePaymentTypeName: string
  saved: boolean
}