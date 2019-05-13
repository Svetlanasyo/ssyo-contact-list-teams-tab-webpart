import * as React from 'react';
import Files from 'react-files';
import * as strings from 'ContactListTeamsTabWebPartStrings';
import styles from "./ContactFormComponent.module.scss";

export interface IFormComponentState {
    name: string;
    phone: string;
    email: string;
    image: string;
    id: number;
    file: File;
    errorNameMessage: string;
    errorPhoneMessage: string;
    errorFileMessage: string;
    buttonName: string;
};

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
            file: null,
            errorNameMessage: '',
            errorPhoneMessage:'',
            buttonName: props.buttonName || strings.Create,
            errorFileMessage: '',
        };
        this.onAdd = this.props.onSubmit;
    };

    public handleSubmit(event) {
        event.preventDefault();
        this.onAdd(this.state);
    };

    public onFilesChange(files) {

        let [file] = files;

        let reader = new FileReader();
        
        reader.onloadend = () => this.setState({ 
            image: reader.result.toString(),
            file: file
        });

        if(file) {
            reader.readAsDataURL(file);
        };
    };

    public onFilesError(error) {
        this.setState({
            errorFileMessage: error.message
        });
    };

    public isValidateLength(e, maxLength) { 
        const val = e.currentTarget.value;
        const max = maxLength;
        console.log(val.length > max);
        return val.length > max
    };

    render() {
        return (
        <form onSubmit={this.handleSubmit.bind(this)} 
                className={styles.generalForm}>
            <label>{ strings.NameLabel } </label>
            <input type="text" 
                    placeholder={ strings.PlaceholderName }
                    required 
                    value={this.state.name}
                    onChange={(event) => {
                        this.isValidateLength(event, 30) ? this.setState({errorNameMessage: strings.ErrorNameMessage}):
                        this.setState({name: event.target.value, errorNameMessage: ""});
                    } }/>
            <label className={styles.errorMessage}>{this.state.errorNameMessage}</label>
                    
            <label>{strings.PhoneLabel}</label>
            <input type="number" 
                    placeholder={ strings.PlaceholderPhone }
                    required 
                    value={this.state.phone}
                    onChange={(event) => {
                        this.isValidateLength(event, 10) ? this.setState({errorPhoneMessage:strings.ErrorPhoneMessage}):
                        this.setState({phone: event.target.value, errorPhoneMessage:""})
                    }}/>
            <label className={styles.errorMessage}>{this.state.errorPhoneMessage}</label>
            <label>{ strings.EMailLabel }</label>
            <input type="email" 
                    placeholder={ strings.PlaceholderEmail } 
                    onChange={(event) => this.setState({email: event.target.value})}
                    required
                    value={this.state.email}/>
            
            <div className="files">
            <label>{ strings.ImageLabel }</label>
            <Files
                className={styles.filesDropzone}
                onChange={this.onFilesChange.bind(this)}
                onError={this.onFilesError.bind(this)}
                accepts={['image/*',]}
                maxFiles={1}
                maxFileSize={500000}
                minFileSize={0}
                clickable
                >
                <img src={this.state.image} 
                    alt={ strings.AltImageInfo } 
                    width="50px" 
                    height="50px" />
                <label className={styles.errorMessage}>{this.state.errorFileMessage}</label>
            </Files>
            </div>

            <button type="submit">{this.state.buttonName}</button>
        </form>
        )
    };
}