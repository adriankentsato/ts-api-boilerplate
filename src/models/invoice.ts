import { IGenericType } from '../interfaces/types/generictype';
import CreateModel from '../bases/base-model';
import DefaultClass from '../bases/default-class';

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
