import * as React from 'react';
import Files from 'react-files';

import styles from "./ContactFormComponent.module.scss";

export interface IFormComponentState {
    name: string;
    phone: string;
    email: string;
    image: string;
    id: number;
    file: File
}

export class ContactFormComponent extends React.Component<any, IFormComponentState> {

    private onAdd;

    constructor(props) {
        super(props);
        this.state = {
            name: props.name || '',
            phone: props.phone || '',
            email: props.email || '',
            image: props.image || '',
            id: this.props.id,
            file: null
        }
        this.onAdd = this.props.onSubmit;
    }

    public handleSubmit(event) {
        event.preventDefault();
        this.onAdd(this.state);
    }

    public onFilesChange(files) {

        let [file] = files;

        let reader = new FileReader();
        
        reader.onloadend = () => this.setState({ 
            image: reader.result.toString(),
            file: file
        });

        if(file) {
            reader.readAsDataURL(file);
        }
    }

    public onFilesError(error, file) {
        console.log('error code '+error.code + ': ' + error.message)
    }

    render() {
        return (
        <form onSubmit={this.handleSubmit.bind(this)} className={styles.generalForm}>
            <label>Contact name: </label>
            <input type="text" 
                    placeholder="Enter name" 
                    onChange={(event) => this.setState({name: event.target.value})}
                    required
                    value={this.state.name}/>
            <label>Contact phone: </label>
            <input type="number" 
                    placeholder="Enter Phone Number"
                    onChange={(event) => this.setState({phone: event.target.value})}
                    required
                    value={this.state.phone}/>
            <label>Contact e-mail: </label>
            <input type="text" 
                    placeholder="Enter email" 
                    onChange={(event) => this.setState({email: event.target.value})}
                    required
                    value={this.state.email}/>
            
            <div className="files">
            <label>Photo: </label>
            <Files
                className={styles.filesDropzone}
                onChange={this.onFilesChange.bind(this)}
                onError={this.onFilesError.bind(this)}
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