import { sp, ItemAddResult } from '@pnp/sp';


export class SharePointRestService {

    static fetchContacts() {
        return sp.web.lists.getByTitle("Contact List")
            .items.get()
            .then((items) => Promise.all(items.map(({ Id, Title, j1d0, z4n7 }) =>
                this.fetchAttachement(Id).then(attachment => ({ name: Title, email: j1d0, phone: z4n7, id: Id, image: attachment })))))
    }

    static fetchAttachement(Id) {
        return sp.web.lists.getByTitle("Contact List").items.getById(Id).attachmentFiles.get().then(v => v[0].ServerRelativeUrl);
    }

    static addContacts(contact) {
        sp.web.lists.getByTitle("Contact List").items.add({
            Title: contact.name,
            j1d0: contact.email,
            z4n7: contact.phone,
            Id: contact.id,
        }).then((iar: ItemAddResult) => {
            console.log(iar);
            let item = sp.web.lists.getByTitle("Contact Lit").items.getById(contact.id);
            item.attachmentFiles.add(contact.name, contact.image).then(v => {
                console.log(v);
            });
        });
    }

}

