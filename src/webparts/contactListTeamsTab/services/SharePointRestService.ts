import { sp, ItemAddResult } from '@pnp/sp';
import { AttachmentFileAddResult } from '@pnp/sp';


export class SharePointRestService {

    static fetchContacts() {
        return sp.web.lists.getByTitle("Contact List")
            .items.get()
            .then((items) => Promise.all(items.map(({ Id, Title, j1d0, z4n7 }) =>
                this.fetchAttachement(Id).then(attachment => ({ name: Title, email: j1d0, phone: z4n7, id: Id, image: attachment })))))
    }

    static fetchAttachement(Id) {
        return sp.web.lists.getByTitle("Contact List").items.getById(Id).attachmentFiles.get().then(v => v[0] ? v[0].ServerRelativeUrl : "");
    }

    static addContacts(contact) {
        return sp.web.lists.getByTitle("Contact List").items.add({
            Title: contact.name,
            j1d0: contact.email,
            z4n7: contact.phone,
            // Id: contact.id,
        }).then((iar: ItemAddResult) => {
            
            return sp.web.lists.getByTitle("Contact List").items.getById(iar.data.Id)
            .attachmentFiles.add(contact.file.name, contact.file);
        }
        );
    }

    static editContacts(contact) {
        sp.web.lists.getByTitle("Contact List").items.getById(contact.id).update({
            Title: contact.name,
            j1d0: contact.email,
            z4n7: contact.phone,
        }).then((iar: ItemAddResult) => {
            console.log(iar.data)
            return sp.web.lists.getByTitle("Contact List").items.getById(contact.id)
            .attachmentFiles.get().then((v) => {
                console.log(v);
                return sp.web.lists.getByTitle("Contact List").items.getById(contact.id)
                .attachmentFiles.getByName(v[0].FileName).setContent(contact.file)
            });
        }
        );
    }
}
