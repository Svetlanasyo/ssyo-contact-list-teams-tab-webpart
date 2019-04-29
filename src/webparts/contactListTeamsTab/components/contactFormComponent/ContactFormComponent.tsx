import * as React from 'react';
import Files from 'react-files';


export interface IFormComponentState {
    name: string;
    phoneNumber: number;
    email: string;
    image: string;
    id: number;
}

export class ContactFormComponent extends React.Component<any, IFormComponentState> {

    private onAdd;

    constructor(props) {
        super(props);
        this.state = {
            name: '',
            phoneNumber: 0,
            email: '',
            image: '',
            id: 0
        }
        this.onAdd = this.props.onSubmit;
    }

    public handleSubmit(event) {
        event.preventDefault();
        this.onAdd(this.state);

    }

    public onFilesChange(files) {
        console.log(files)
    }

    public onFilesError(error, file) {
        console.log('error code '+error.code + ': ' + error.message)
    }

    render() {
        return (
        <form onSubmit={this.handleSubmit.bind(this)} className="general-form">
            <label>Contact name: </label>
            <input type="text" 
                    placeholder="Enter name" 
                    onChange={(event) => this.setState({name: event.target.value})}/>
            <label>Contact phone: </label>
            <input type="number" 
                    placeholder="Enter Phone Number"
                    onChange={(event) => this.setState({phoneNumber: 225555})}/>
            <label>Contact e-mail: </label>
            <input type="text" 
                    placeholder="Enter email" 
                    onChange={(event) => this.setState({email: 'event.target.value'})}/>
            
            <div className="files">
            <label>Photo: </label>
            <Files
                className="files-dropzone"
                onChange={this.onFilesChange}
                onError={this.onFilesError}
                accepts={['image/png',]}
                maxFiles={1}
                maxFileSize={1000000}
                minFileSize={0}
                clickable
                >
                Drop files here or click to upload
                </Files>
            </div>

            <button type="submit">Create</button>
        </form>
        )
    }
}