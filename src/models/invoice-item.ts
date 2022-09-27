import { IObjectKeysMap, IObjectMap } from '../interfaces/types/object-map';
import Model from '../bases/base-model';
import { TVersionedSchema } from '../interfaces/types/versioned-schema';

type TInvoiceItem = IObjectKeysMap<['id', 'productId', 'description'], string> & IObjectKeysMap<['quantity', 'unitPrice', 'total'], number>;
type TDbItemSchema = IObjectKeysMap<['id', 'prodId', 'desc'], string> & IObjectKeysMap<['qty', 'price'], number>;
type TRestItemSchema = IObjectKeysMap<['id', 'productId', 'description'], string> & IObjectKeysMap<['quantity', 'unitPrice'], number>;
type TDbInvoiceItem = TVersionedSchema<'db', TDbItemSchema>;
type TRestInvoiceItem = TVersionedSchema<'rest', TRestItemSchema>;
type TInvoiceItemInput = TDbInvoiceItem | TRestInvoiceItem;
type TInvoiceItemMapper = IObjectKeysMap<['product'], IObjectMap<string>>;

export default class InvoiceItem extends Model.Create<TInvoiceItemInput, TInvoiceItem, TInvoiceItemMapper>({
    db: {
        id: 'id',
        productId: 'prodId',
        description: 'desc',
        quantity: 'qty',
        unitPrice: 'price',
        total: (data) => {
            const qty = data.qty ?? 0;
            const price = data.price ?? 0;
            return Number(qty) * Number(price);
        },
    },
    rest: {
        id: 'id',
        productId: 'productId',
        description: 'description',
        quantity: 'quantity',
        unitPrice: 'unitPrice',
        total: (data) => {
            const quantity = data.quantity ?? 0;
            const unitPrice = data.unitPrice ?? 0;
            return Number(quantity) * Number(unitPrice);
        },
    },
}) {}
