package org.kine.backend.errors;

public record CustomFieldError(
        String field,
        String message) {

    public CustomFieldError(String field, String message) {
        this.field = field;
        this.message = message;
    }

    public String getField() {
        return field;
    }

    public String getMessage() {
        return message;
    }

    @Override
    public String toString() {
        return "CustomFieldError{" +
                "field='" + field + '\'' +
                ", message='" + message + '\'' +
                '}';
    }

    @Override
    public boolean equals(Object o) {
        if (this == o)
            return true;
        if (!(o instanceof CustomFieldError))
            return false;
        CustomFieldError that = (CustomFieldError) o;
        return field.equals(that.field) && message.equals(that.message);
    }

    @Override
    public int hashCode() {
        return 31 * field.hashCode() + message.hashCode();
    }

    public static CustomFieldError of(String field, String message) {
        return new CustomFieldError(field, message);
    }
}