import { Order, OrderItem, OrderPayload } from '../types'

const productkeygenerator = (product: any) => {
    var key: string = ''
    key = product.ProductId ? product.ProductId.toString() : product.Id.toString()
    if (product.OptionGroup) {
        product.OptionGroup.forEach((opg: any) => {
            if (opg.selected) {
                opg.Option.forEach((option: any) => {
                    if (option.selected) {
                        key += '_' + option.Id
                    }
                })
            }
        })
    }
    return key
}
const getshowname = (product: any) => {
    var name: string = product.Product
    if (product.OptionGroup) {
        product.OptionGroup.forEach((opg: any) => {
            if (opg.selected) {
                opg.Option.forEach((option: any) => {
                    if (option.selected) {
                        if (opg.OptionGroupType == 1) name += '/' + option.Name
                        if (opg.OptionGroupType == 2) name += '+' + option.Name
                    }
                })
            }
        })
    }
    return name
}

const neworder = (options: any) => {
    var order: Order = {
        Id: 0,
        AggregatorOrderId: 0,
        AllItemDisc: 0,
        AllItemTaxDisc: 0,
        AllItemTotalDisc: 0,
        BillAmount: 0,
        BillDate: '',
        BillDateTime: '',
        BillStatusId: 0,
        ChargeJson: '',
        Charges: 0,
        Closed: false,
        CompanyId: 0,
        CustomerAddressId: 0,
        CustomerData: '',
        CustomerId: 0,
        CustomerDetails: {
            Id: 0,
            Name: '',
            Email: '',
            PhoneNo: '',
            Address: '',
            City: '',
            PostalCode: 0,
            googlemapurl: '',
            CompanyId: 0,
            StoreId: 0,
            Sync: 0,
            val: 0
        },
        DeliveryDateTime: '',
        DiningTableId: options.tableid,
        DiscAmount: 0,
        DiscPercent: 0,
        DiscType: 0,
        FoodReady: false,
        InvoiceNo: '',
        IsAdvanceOrder: [3, 4].includes(options.typeid) ? true : false,
        ItemJson: '',
        Items: [],
        KOTS: [],
        ModifiedDate: '',
        Note: '',
        OrderDiscount: 0,
        OrderedDate: '',
        OrderedDateTime: '',
        OrderJson: '',
        OrderNo: 0,
        OrderId: 0,
        OrderStatusDetails: '',
        OrderStatusId: 0,
        OrderTaxDisc: 0,
        OrderTotDisc: 0,
        OrderTypeId: options.typeid,
        OrderName: '',
        PaidAmount: 0,
        PreviousStatusId: 0,
        RefundAmount: 0,
        RiderStatusDetails: '',
        Source: '',
        SourceId: 1,
        SplitTableId: 0,
        StorePaymentTypeId: 0,
        PaymentTypeId: 0,
        StoreId: 0,
        Tax1: 0,
        Tax2: 0,
        Tax3: 0,
        UPOrderId: 0,
        UserId: 0,
        WaiterId: 0,
        TaxAmount: 0,
        additionalchargearray: [],
        subtotal: 0,
        extra: 0,
        events: [],
        datastatus: '',
        status: '',
        Transactions: [],
        istaxinclusive: false,
        changeditems: [],
        diningtablekey: options.tablekey,
        isordersaved: false,
        deliverytimestamp: 0,
        DeliveryStoreId: 0,
        createdtimestamp: new Date().getTime(),
        deliveryclicked: false,
        alltransactions: [],
        appversion: '0.1.0',
        UserName: options.username,
        app: 'waiterapp'
    };
    return order
}

const newPayload = (options: any) => {
    const payload: OrderPayload = {
        OrderTypeId: options.typeid,
        Items: [],
        UserId: options.userid,
        Transactions: [],
        CustomerDetails: {
            Id: 0,
            Name: '',
            Email: '',
            PhoneNo: '',
            Address: '',
            City: '',
            PostalCode: 0,
            googlemapurl: '',
            CompanyId: 0,
            StoreId: 0,
            Sync: 0,
            val: 0
        },
        InvoiceNo: options.invoiceno,
        _id: '',
        DeliveryDateTime: '',
        DiningTableId: options.tableid,
        DiningTableKey: options.tablekey
    }
    return payload
}

const orderItem = (product: any, quantity: number) => {
    const orderItem: OrderItem = {
        Id: 0,
        CategoryId: product.CategoryId,
        ComplementryQty: product.ComplementryQty ? product.ComplementryQty : 0,
        DiscAmount: product.DiscAmount,
        DiscPercent: product.DiscPercent,
        DiscType: product.DiscType,
        Extra: 0,
        FreeQtyPercentage: product.FreeQtyPercentage,
        ItemDiscount: 0,
        KitchenUserId: null,
        KOTGroupId: product.KOTGroupId ? product.KOTGroupId : 0,
        KOTId: 0,
        Message: '',
        MinimumQty: product.MinimumQty,
        Note: '',
        OptionJson: '',
        OptionGroup: [],
        OrderDiscount: 0,
        OrderId: 0,
        Price: product.Price,
        ProductId: product.ProductId ? product.ProductId : product.Id,
        ProductKey: productkeygenerator(product),
        Name: product.Product,
        Quantity: quantity,
        StatusId: 0,
        tax1_p: 0,
        tax2_p: 0,
        tax3_p: 0,
        Tax1: product.Tax1,
        Tax2: product.Tax2,
        Tax3: product.Tax3,
        TaxGroupId: product.TaxGroupId,
        TaxItemDiscount: 0,
        TaxOrderDiscount: 0,
        TotalAmount: 0,
        TaxAmount1: 0,
        TaxAmount2: 0,
        TaxAmount3: 0,
        TaxAmount: 0,
        IsTaxInclusive: product.IsTaxInclusive,
        Product: product.Product,
        showname: getshowname(product),
        isorderitem: false,
        kotquantity: 0,
        baseprice: 0,
        kotrefid: '',
        refid: ''
    }
    return orderItem
}

export default {
    neworder: (options: any) => neworder(options),
    newPayload: (options: any) => newPayload(options),
    orderItem: (product: any, quantity: number) => orderItem(product, quantity),
    productkeygenerator: (product: any) => productkeygenerator(product),
};