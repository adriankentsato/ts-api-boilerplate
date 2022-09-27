import { IObjectKeysMap, IObjectMap } from '../interfaces/types/object-map';
import Model from '../bases/base-model';
import { TVersionedSchema } from '../interfaces/types/versioned-schema';
import InvoiceItem from './invoice-item';

type TInvoice = IObjectKeysMap<['id', 'invoiceDate', 'userId', 'customerId'], string> & IObjectKeysMap<['items'], Array<InvoiceItem>>;
type TDbSchema = IObjectKeysMap<['id', 'invDate', 'userId', 'custId'], string> & IObjectKeysMap<['items'], Array<any>>;
type TRestSchema = IObjectKeysMap<['id', 'invoiceDate', 'userId', 'customerId'], string> & IObjectKeysMap<['items'], Array<any>>;
type TDbInvoice = TVersionedSchema<'db', TDbSchema>;
type TRestInvoice = TVersionedSchema<'rest', TRestSchema>;
type TInvoiceInput = TDbInvoice | TRestInvoice;
type TInvoiceMapper = IObjectKeysMap<['customer', 'product'], IObjectMap<string>>;

export default class Invoice extends Model.Create<TInvoiceInput, TInvoice, TInvoiceMapper>({
    db: {
        id: 'id',
        invoiceDate: 'invDate',
        userId: 'userId',
        customerId: 'custId',
        items: (data: TDbSchema, fieldMap: TInvoiceMapper) => {
            const items = data.items || [];
            return Array.isArray(items) 
                ? items.map(item => new InvoiceItem({ version: 'db', schema: item }, fieldMap))
                : [];
        },
    },
    rest: {
        id: 'id',
        invoiceDate: 'invoiceDate',
        userId: 'userId',
        customerId: 'customerId',
        items: (data: TRestSchema, fieldMap: TInvoiceMapper) => {
            const items = data.items || [];
            return Array.isArray(items) 
                ? items.map(item => new InvoiceItem({ version: 'rest', schema: item }, fieldMap))
                : [];
        },
    },
}) {}
