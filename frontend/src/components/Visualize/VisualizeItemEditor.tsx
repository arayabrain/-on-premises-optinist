import React from 'react'
import { useDispatch, useSelector } from 'react-redux'

import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import InputLabel from '@material-ui/core/InputLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import Select from '@material-ui/core/Select'
import ListSubheader from '@material-ui/core/ListSubheader'
import Box from '@material-ui/core/Box'

import {
  selectSelectedVisualizeItemId,
  selectVisualizeDataFilePath,
  selectVisualizeDataNodeId,
  selectVisualizeDataType,
  selectVisualizeItemType,
} from 'store/slice/VisualizeItem/VisualizeItemSelectors'
import { VISUALIZE_ITEM_TYPE_SET } from 'store/slice/VisualizeItem/VisualizeItemType'
import {
  DATA_TYPE,
  DATA_TYPE_SET,
} from 'store/slice/DisplayData/DisplayDataType'
import { RootState } from 'store/store'
import {
  setDisplayDataPath,
  setItemType,
} from 'store/slice/VisualizeItem/VisualizeItemSlice'
import { selectInputNode } from 'store/slice/InputNode/InputNodeSelectors'
import { FILE_TYPE_SET } from 'store/slice/InputNode/InputNodeType'
import { selectAlgorithmNode } from 'store/slice/AlgorithmNode/AlgorithmNodeSelectors'
import { selectOutputPaths } from 'store/slice/RunPipelineResult/RunPipelineResultSelectors'
import { toDataType } from 'store/slice/DisplayData/DisplayDataUtils'
import { selectNodeLabelById } from 'store/slice/FlowElement/FlowElementSelectors'
import { ImageItemEditor } from './Editor/ImageItemEditor'
import { TableItemEditor } from './Editor/TableItemEditor'
import { HeatmapItemEditor } from './Editor/HeatmapItemEditor'
import { TimeSeriesItemEditor } from './Editor/TimeSeriesItemEditor'
import { RoiItemEditor } from './Editor/RoiItemEditor'

export const VisualizeItemEditor = () => {
  const selectedItemId = useSelector(selectSelectedVisualizeItemId)
  return (
    <>
      {selectedItemId != null ? (
        <SelectedItemIdContext.Provider value={selectedItemId}>
          <Box m={1}>
            <ItemTypeSelect />
            <Editor />
          </Box>
        </SelectedItemIdContext.Provider>
      ) : (
        'Please select item...'
      )}
      <br />
    </>
  )
}

export const SelectedItemIdContext = React.createContext<number>(NaN)

const ItemTypeSelect: React.FC = () => {
  const itemId = React.useContext(SelectedItemIdContext)
  const dispatch = useDispatch()
  const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
    dispatch(
      setItemType({
        itemId,
        type: event.target.value as
          | typeof VISUALIZE_ITEM_TYPE_SET.DEFAULT_SET
          | DATA_TYPE,
      }),
    )
  }
  const selectedType = useSelector((state: RootState) => {
    const itemType = selectVisualizeItemType(itemId)(state)
    if (itemType === VISUALIZE_ITEM_TYPE_SET.DEFAULT_SET) {
      return VISUALIZE_ITEM_TYPE_SET.DEFAULT_SET
    } else {
      return selectVisualizeDataType(itemId)(state)
    }
  })
  const options: (typeof VISUALIZE_ITEM_TYPE_SET.DEFAULT_SET | DATA_TYPE)[] = [
    VISUALIZE_ITEM_TYPE_SET.DEFAULT_SET,
    ...Object.values(DATA_TYPE_SET),
  ]
  return (
    <FormControl style={{ minWidth: 120, marginBottom: 12 }}>
      <InputLabel id="demo-simple-select-helper-label">item type</InputLabel>
      <Select
        value={selectedType != null ? selectedType : 'none'}
        onChange={handleChange}
      >
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

const Editor: React.FC = () => {
  const itemId = React.useContext(SelectedItemIdContext)
  const itemType = useSelector(selectVisualizeItemType(itemId))
  switch (itemType) {
    case VISUALIZE_ITEM_TYPE_SET.DEFAULT_SET:
      return <DefaultSetItemEditor />
    case VISUALIZE_ITEM_TYPE_SET.DISPLAY_DATA:
      return <DisplayDataItemEditor />
  }
}

const DefaultSetItemEditor: React.FC = () => {
  // const itemId = React.useContext(SelectedItemIdContext)
  return <div>DefaultSetItemEditor(not imple)</div>
}

const DisplayDataItemEditor: React.FC = () => {
  const itemId = React.useContext(SelectedItemIdContext)
  const dataType = useSelector(selectVisualizeDataType(itemId))
  return (
    <div>
      <FilePathSelect />
      <div style={{ marginTop: 8 }}>
        {dataType === DATA_TYPE_SET.IMAGE && <ImageItemEditor />}
        {/* 他のtypeのEditorも必要になったら追加する */}
        {dataType === DATA_TYPE_SET.TABLE && <TableItemEditor />}
        {dataType === DATA_TYPE_SET.HEAT_MAP && <HeatmapItemEditor />}
        {dataType === DATA_TYPE_SET.TIME_SERIES && <TimeSeriesItemEditor />}
        {dataType === DATA_TYPE_SET.ROI && <RoiItemEditor />}
      </div>
    </div>
  )
}

const FilePathSelect: React.FC = () => {
  const itemId = React.useContext(SelectedItemIdContext)
  const dispatch = useDispatch()
  const dataType = useSelector(selectVisualizeDataType(itemId))
  const inputNodeFilePathInfoList = useSelector(
    (state: RootState) => {
      const inputNodes = selectInputNode(state)
      return Object.entries(inputNodes)
        .map(([nodeId, inputNode]) => ({
          nodeId,
          filePath: inputNode.selectedFilePath,
          fileType: inputNode.fileType,
          nodeName: selectNodeLabelById(nodeId)(state),
        }))
        .filter(({ filePath }) => filePath != null)
        .filter(({ fileType }) => {
          switch (dataType) {
            case DATA_TYPE_SET.IMAGE:
              return fileType === FILE_TYPE_SET.IMAGE
            case DATA_TYPE_SET.TABLE:
              return fileType === FILE_TYPE_SET.CSV
            default:
              return false
          }
        })
    },
    // todo 比較関数
  )

  const algorithmNodeOutputPathInfoList = useSelector((state: RootState) => {
    const algorithms = selectAlgorithmNode(state)
    const outputPaths = selectOutputPaths(state)
    if (outputPaths != null) {
      return Object.entries(algorithms)
        .filter(([nodeId, algoNode]) =>
          Object.keys(outputPaths).includes(algoNode.functionPath),
        )
        .map(([nodeId, algoNode]) => {
          const paths = Object.entries(outputPaths[algoNode.functionPath])
            .map(([outputKey, outputPath]) => ({
              outputKey,
              filePath: outputPath.path,
              type: toDataType(outputPath.type),
            }))
            .filter(({ type }) => type === dataType)
          return {
            nodeName: selectNodeLabelById(nodeId)(state),
            nodeId,
            paths,
          }
        })
        .filter(({ paths }) => paths.length > 0)
    } else {
      return []
    }
  })

  const [open, setOpen] = React.useState(false)
  const handleClose = () => {
    setOpen(false)
  }

  const handleOpen = () => {
    setOpen(true)
  }
  const onSelect = (nodeId: string, filePath: string) => {
    dispatch(setDisplayDataPath({ nodeId, filePath, itemId }))
    handleClose()
  }

  const selectedFilePath = useSelector(selectVisualizeDataFilePath(itemId))
  const selectedNodeId = useSelector(selectVisualizeDataNodeId(itemId))

  const menuItemList: React.ReactElement[] = []
  inputNodeFilePathInfoList.forEach((pathInfo) => {
    menuItemList.push(
      <MenuItem
        value={`${pathInfo.nodeId}/${pathInfo.filePath}`}
        onClick={() => onSelect(pathInfo.nodeId, pathInfo.filePath ?? '')}
        key={pathInfo.nodeId}
      >
        {pathInfo.nodeName}
      </MenuItem>,
    )
  })
  algorithmNodeOutputPathInfoList.forEach((pathInfo) => {
    menuItemList.push(<ListSubheader>{pathInfo.nodeName}</ListSubheader>)
    pathInfo.paths.forEach((outputPath, i) => {
      menuItemList.push(
        <MenuItem
          value={`${pathInfo.nodeId}/${outputPath.filePath}`}
          onClick={() => onSelect(pathInfo.nodeId, outputPath.filePath)}
          key={`${pathInfo.nodeId}/${outputPath.filePath}`}
        >
          {outputPath.outputKey}
        </MenuItem>,
      )
    })
  })
  return (
    <FormControl style={{ minWidth: 150, maxWidth: 220 }}>
      <InputLabel>Select Item</InputLabel>
      <Select
        value={`${selectedNodeId}/${selectedFilePath}`}
        open={open}
        onClose={handleClose}
        onOpen={handleOpen}
      >
        {menuItemList}
      </Select>
      {inputNodeFilePathInfoList.length +
        algorithmNodeOutputPathInfoList.length ===
        0 && <FormHelperText error={true}>no data</FormHelperText>}
    </FormControl>
  )
}