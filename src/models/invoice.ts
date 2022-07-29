import { IGenericType } from '../interfaces/types/generictype';
import { IObjectKeysMap } from '../interfaces/types/object-map';
import CreateModel from '../utils/base-model';

type TInvoice = IObjectKeysMap<['id', 'invoiceDate', 'userId', 'customerId', 'data'], string>;
type TDbInvoice = IObjectKeysMap<['id', 'invDate', 'userId', 'custId'], string>;

const Model = CreateModel<TInvoice, TDbInvoice>({
    id: 'id',
    invoiceDate: 'invDate',
    userId: 'userId',
    customerId: 'custId',
    data: (data) => data.custId,
});

export default class Invoice extends Model {
    private customer: IGenericType;

    constructor(dbInv: TDbInvoice) {
        super(dbInv);

        this.customer = {};
    }

    public toJSON() {
        return {
            ...super.toJSON(),
            customer: this.customer,
        };
    }
}
