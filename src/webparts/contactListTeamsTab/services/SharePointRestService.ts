import {sp} from '@pnp/sp';

export class SharePointRestService {

    static fetchContacts() {
        sp.web.lists.getByTitle("Contact List")
            .items.get()
            .then(console.log)
    }
}