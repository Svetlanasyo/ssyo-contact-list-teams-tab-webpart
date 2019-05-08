import { sp, ItemAddResult } from '@pnp/sp';
import {AttachmentFileAddResult} from '@pnp/sp';


export class SharePointRestService {

    static fetchContacts(listName: string) {
        return sp.web.lists.getByTitle(listName)
            .items.get()
            .then((items) => Promise.all(items.map(({ Id, Title, Email, Phone }) =>
                this.fetchAttachement(Id, listName).then(attachment => ({ name: Title, 
                                                                        email: Email, 
                                                                        phone: Phone, 
                                                                        id: Id, 
                                                                        image: attachment })))));
    };

    static fetchAttachement(Id, listName: string) {
        return sp.web.lists.getByTitle(listName).items.getById(Id)
            .attachmentFiles.get()
            .then(v => v[0] ? v[0].ServerRelativeUrl : "");
    };

    static addContacts(contact, listName: string) {
        return sp.web.lists.getByTitle(listName).items.add({
            Title: contact.name,
            Email: contact.email,
            Phone: contact.phone,
            // Id: contact.id,
        }).then((iar: ItemAddResult) => {
            return sp.web.lists.getByTitle(listName).items.getById(iar.data.Id)
            .attachmentFiles.add(contact.file.name, contact.file);
        });
    };

    static editContacts(contact, listName: string) {
        return sp.web.lists.getByTitle(listName)
            .items.getById(contact.id)
            .update({
                Title: contact.name,
                Email: contact.email,
                Phone: contact.phone,})
            .then(async(iar: ItemAddResult) => {
                try {
                    let actualList = await sp.web.lists.getByTitle(listName);
                    let actualRow = await actualList
                                        .items.getById(contact.id);
                    let actualAttachments = await actualRow
                                            .attachmentFiles.get();
                    if (!actualAttachments[0]) {
                        var fileName = contact.file.name 
                    } else {
                    let fileName = actualAttachments[0].FileName;
                    await actualRow.attachmentFiles.deleteMultiple(fileName);
                    }
                    await actualRow.attachmentFiles.add(fileName, contact.file)
                    
                                            
                } catch(err) {
                    console.log(err)
                }
            })
                               
    };

    static async checkListExistance(listName: string) {
        try {
            let {list: {fields}} = await sp.web.lists.ensure(listName);
            
            try {
                await fields.getByInternalNameOrTitle("Title").get();
            } catch {
                fields.addText("Title");
            };
            
            try {
                await fields.getByInternalNameOrTitle("Phone").get();
            } catch {
                fields.addBoolean("Phone");
            };

            try {
                await fields.getByInternalNameOrTitle("Email").get();
            } catch {
                fields.addBoolean("Email");
            };
        }
        catch(err) {
            console.log(err)
        };
    };
}
