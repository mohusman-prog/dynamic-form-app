import { required } from "serverless/lib/config-schema"

export const ValidateField = (field,value) => {
    if (field.required && (!value || value .length === 0)) {
        return `${field.label} is required`     
    }
    if (field.type === 'email'){
        const regex = /\S+@\S+\. \S+/
        if(!regex.test(value)) return 'Invalid email format'
    }
    if (field.type === 'number' && field.min){
        if(Number(value) < field.min) return `${field.label} must be at least ${field.min}`
    }
    return ' ';
}