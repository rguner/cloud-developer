
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDATCCAemgAwIBAgIJAWP9ocPDRPt4MA0GCSqGSIb3DQEBCwUAMB4xHDAaBgNV
BAMTE3JndW5lci51cy5hdXRoMC5jb20wHhcNMjAwNjEzMjMyODIxWhcNMzQwMjIw
MjMyODIxWjAeMRwwGgYDVQQDExNyZ3VuZXIudXMuYXV0aDAuY29tMIIBIjANBgkq
hkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAzMjBAMHpu2Qx02kc5/vVj1WVxAaPaAcL
IRctV7zRnJz2boKzZ2mmF2cBMQnJhFwwrpiORValCU/w73XvSn6JvNR2jBx+tLdQ
qZjgm+v4CfVdbTIGju2Pcrv5UgP+R9HnEuIXh4h4Wy44jTtkztasOU1ikbHGFw8l
7XmqIJm0yCWZcyLE1W99GPQUuu6wfmMY4rhp2wCikWJEW7rtNmSvKIkDPlh9AaMD
pC/DlX7mGAhCnHeD+Otl3kRkDtaPfppaI0HifLLQfHpY858FIk1ChwSalC7CmYAh
PB7WG9NNUFF20QOEKtWbpmc8CuS2nqYLR2jr9yiXzTQ62rylArqQiwIDAQABo0Iw
QDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBSJc50SRQgPiHfeE+X9CnWa43zb
ujAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEBAJeBbI7NbwJzdzoJ
IvL7xaY/HCYi9s0RInsoKLsbRwIy6qAET9luQIKhYglA7o/KIu48zqOwcG3B9Fir
COLJ/zsN+x5iHHls63QsMQ+U1bgAmcP2rmy1L4HY/w8sGdD08rEAbwojx8Wo0TFu
5bnEGk+c4AbYI0vdbP0zte1ZOgkfG42yV8y3FWyRXGAfsNaUbmILObp2d4KfVeKz
ROY8qH42tl/nJZnWALl2i6CZHzHGSPi7sSpQeI6U7bAT/KOi9EXjQXJxYtIbACFU
RVo/0TVSR4DJw1V491jlVPqK1AQlK6OEgS4COoMncGq7lzrSdGFSkYVQvqO7XmXc
gf9gYhU=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
