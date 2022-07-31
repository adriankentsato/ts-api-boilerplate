import { IGenericType } from '../interfaces/types/generictype';
import { IObjectKeysMap, IObjectMap } from '../interfaces/types/object-map';
import CreateModel from '../bases/base-model';
import DefaultClass from '../bases/default-class';

type TInvoice = IObjectKeysMap<['id', 'invoiceDate', 'userId', 'customerId', 'data'], string>;
type TDbInvoice = IObjectKeysMap<['id', 'invDate', 'userId', 'custId'], string>;
type TInvoiceMapper = IObjectKeysMap<['customer'], IObjectMap<string>>;

const Model = CreateModel<TInvoice, TDbInvoice, typeof DefaultClass, TInvoiceMapper>({
    id: 'id',
    invoiceDate: 'invDate',
    userId: 'userId',
    customerId: 'custId',
    data: (data, fieldMap) => fieldMap.customer[data.custId.toString()],
});

export default class Invoice extends Model {
    private customer: IGenericType;

    constructor(dbInv: TDbInvoice, mapper: TInvoiceMapper) {
        super(dbInv, mapper);

        this.customer = {};
    }

    public toJSON() {
        return {
            ...super.toJSON(),
            customer: this.customer,
        };
    }
}
