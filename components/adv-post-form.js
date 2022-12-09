import AccordianItem from './accordian-item'
import * as Yup from 'yup'
import { Input, InputUserSuggest } from './form'
import { InputGroup } from 'react-bootstrap'
import { BOOST_MIN } from '../lib/constants'
import { NAME_QUERY } from '../fragments/users'
import Info from './info'

export function AdvPostSchema (client) {
  return {
    boost: Yup.number().typeError('must be a number')
      .min(BOOST_MIN, `must be blank or at least ${BOOST_MIN}`).integer('must be whole').test({
        name: 'boost',
        test: async boost => {
          if (!boost || boost % BOOST_MIN === 0) return true
          return false
        },
        message: `must be divisble be ${BOOST_MIN}`
      }),
    forward: Yup.string()
      .test({
        name: 'name',
        test: async name => {
          if (!name || !name.length) return true
          const { data } = await client.query({ query: NAME_QUERY, variables: { name }, fetchPolicy: 'network-only' })
          return !data.nameAvailable
        },
        message: 'user does not exist'
      })
  }
}

export function AdvPostInitial ({ forward }) {
  return {
    boost: '',
    forward: forward || ''
  }
}

export default function AdvPostForm ({ edit }) {
  return (
    <AccordianItem
      header={<div style={{ fontWeight: 'bold', fontSize: '92%' }}>options</div>}
      body={
        <>
          <Input
            label={
              <div className='d-flex align-items-center'>{edit ? 'add boost' : 'boost'}
                <Info>
                  <ol className='font-weight-bold'>
                    <li>Boost ranks posts higher temporarily based on the amount</li>
                    <li>The minimum boost is {BOOST_MIN} sats</li>
                    <li>Each {BOOST_MIN} sats of boost is equivalent to one trusted upvote
                      <ul>
                        <li>e.g. {BOOST_MIN * 2} sats is like 2 votes</li>
                      </ul>
                    </li>
                    <li>The decay of boost "votes" increases at 2x the rate of organic votes
                      <ul>
                        <li>i.e. boost votes fall out of ranking faster</li>
                      </ul>
                    </li>
                    <li>100% of sats from boost are given back to top users as rewards</li>
                  </ol>
                </Info>
              </div>
            }
            name='boost'
            hint={<span className='text-muted'>ranks posts higher temporarily based on the amount</span>}
            append={<InputGroup.Text className='text-monospace'>sats</InputGroup.Text>}
          />
          <InputUserSuggest
            label={<>forward sats to</>}
            name='forward'
            hint={<span className='text-muted'>100% of sats will be sent to this user</span>}
            prepend={<InputGroup.Text>@</InputGroup.Text>}
            showValid
          />
        </>
      }
    />
  )
}
