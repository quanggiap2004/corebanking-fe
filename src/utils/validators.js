import * as yup from 'yup';

// Login validation schema
export const loginSchema = yup.object().shape({
    username: yup
        .string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must not exceed 50 characters'),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
});

// Registration validation schema
export const registerSchema = yup.object().shape({
    username: yup
        .string()
        .required('Username is required')
        .min(3, 'Username must be at least 3 characters')
        .max(50, 'Username must not exceed 50 characters')
        .matches(/^[a-zA-Z0-9_]+$/, 'Username can only contain letters, numbers, and underscores'),
    password: yup
        .string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters'),
    confirmPassword: yup
        .string()
        .required('Please confirm your password')
        .oneOf([yup.ref('password')], 'Passwords must match'),
    fullName: yup
        .string()
        .required('Full Name is required')
        .min(2, 'Full Name must be at least 2 characters'),
    email: yup
        .string()
        .required('Email is required')
        .email('Please enter a valid email address'),
    phone: yup
        .string()
        .nullable()
        .matches(/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, {
            message: 'Please enter a valid phone number',
            excludeEmptyString: true,
        }),
    address: yup.string().nullable(),
    idDocumentNumber: yup.string().nullable(),
});

// Transfer validation schema
export const transferSchema = yup.object().shape({
    sourceAccountNumber: yup
        .string()
        .required('Please select a source account')
        .test('not-same', 'Source and destination accounts must be different', function (value) {
            return value !== this.parent.destinationAccountNumber;
        }),
    destinationAccountNumber: yup
        .string()
        .required('Destination account number is required')
        .min(3, 'Invalid account number')
        .test('not-same', 'Source and destination accounts must be different', function (value) {
            return value !== this.parent.sourceAccountNumber;
        }),
    amount: yup
        .number()
        .required('Amount is required')
        .positive('Amount must be positive')
        .min(0.01, 'Minimum transfer amount is $0.01')
        .max(100000, 'Maximum transfer amount is $100,000.00'),
    transferType: yup
        .string()
        .required('Please select a transfer type')
        .oneOf(['INTERNAL', 'INTERBANK_MOCK'], 'Invalid transfer type'),
    description: yup
        .string()
        .nullable()
        .max(255, 'Description must not exceed 255 characters'),
});

