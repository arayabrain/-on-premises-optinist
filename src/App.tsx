import './App.css'
import { Layout, Model, TabNode } from 'flexlayout-react'
import 'flexlayout-react/style/light.css'
import { flexjson } from 'const/flexlayout'
import SideBar from 'components/SideBar'
import FlowChart from 'components/FlowChart'
import ParamForm from 'components/ParamForm'
import PlotOutput from 'components/PlotOutput'

const model = Model.fromJson(flexjson)

function App() {
  const factory = (node: TabNode) => {
    var component = node.getComponent()
    if (component === 'button') {
      return <button>{node.getName()}</button>
    } else if (component == 'flowchart') {
      return <FlowChart />
    } else if (component == 'sidebar') {
      return <SideBar />
    } else if (component == 'paramForm') {
      return <ParamForm />
    } else if (component == 'output') {
      return <PlotOutput />
    } else {
      return null
    }
  }

  return <Layout model={model} factory={factory} />
}

export default App