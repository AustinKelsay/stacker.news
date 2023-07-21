import Layout from '../../../../components/layout'
import Items from '../../../../components/items'
import { useRouter } from 'next/router'
import { getGetServerSideProps } from '../../../../api/ssrApollo'
import TopHeader from '../../../../components/top-header'
import { SUB_ITEMS } from '../../../../fragments/subs'
import { COMMENT_TYPE_QUERY } from '../../../../lib/constants'

const staticVariables = { sort: 'top' }
const variablesFunc = vars =>
  ({ includeComments: COMMENT_TYPE_QUERY.includes(vars.type), ...staticVariables, ...vars })
export const getServerSideProps = getGetServerSideProps(
  SUB_ITEMS,
  variablesFunc,
  (data, vars) => vars.sub && !data.sub)

export default function Index ({ ssrData }) {
  const router = useRouter()
  const variables = variablesFunc(router.query)

  return (
    <Layout sub={variables.sub}>
      <TopHeader sub={variables.sub} cat={variables.type} />
      <Items
        ssrData={ssrData}
        query={SUB_ITEMS}
        variables={variables} rank
        noMoreText='NO MORE'
      />
    </Layout>
  )
}
