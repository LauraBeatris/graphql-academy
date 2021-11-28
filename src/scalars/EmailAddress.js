import { 
  Kind,
  GraphQLError,
  GraphQLScalarType, 
} from 'graphql'

const EMAIL_ADDRESS_REGEX =
    /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/

/**
 * 
 * @param {any} value - Given value from GraphQL operation
 * @returns {String} - Formatted email address as string type
 */
const validateEmailValue = (value) => {
  if (typeof value !== 'string') {
    throw new TypeError(`Value is not string: ${value}`)
  }

  if (!EMAIL_ADDRESS_REGEX.test(value)) {
    throw new TypeError(`Value is not a valid email address: ${value}`);
  }

  return value
};

const GraphQLEmailAddressConfig = {
  name: 'EmailAddress',
  description:
    'A field whose value conforms to the standard internet email address format as specified in RFC822: https://www.w3.org/Protocols/rfc822/.',
  serialize: validateEmailValue,
  parseValue: validateEmailValue,
  parseLiteral: (ast) => {
    if (ast.kind !== Kind.STRING){
      throw new GraphQLError(`Can only validate strings as email addresses but got a: ${ast.kind}`)
    }

    return validate(ast.value);
  }
}

const GraphQLEmailAddress = new GraphQLScalarType(GraphQLEmailAddressConfig)

export { GraphQLEmailAddress } 
