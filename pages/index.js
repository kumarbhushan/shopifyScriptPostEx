import { Card, Layout, Page, AppProvider } from "@shopify/polaris";
import "@shopify/polaris/styles.css";
import './index.css'
export default class Index extends React.Component {
  static async getInitialProps({ req }) {
    const userAgent = req ? req.serverData : {}
    return { userAgent }
  }
  state = {
    amount: 0
  };
  render() {
    return (
      <AppProvider>
        <Page>
          <Layout>
            <Card>App Is Working</Card>
          </Layout>
        </Page>
      </AppProvider>
    );
  }
}
