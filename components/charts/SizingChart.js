const SizingChart = ({ data }) => {
  return (
    <div>
      <div dangerouslySetInnerHTML={{ __html: addSizingChartDesign(data) }} />
    </div>
  )
}

const addSizingChartDesign = (data) => {
  let buffer = ''

  buffer += '<div class="teelaunch-sizing-chart" style="display: block">'
  for (let i = 0; i < data?.length; i++) {
    buffer += prepareChartBlock(data[i])
  }
  buffer += '</div>'

  return buffer
}

const prepareChartBlock = (data) => {
  let buffer = ''

  buffer += '<table>'
  buffer += '<tbody>'

  buffer += '<tr>'
  buffer += '<th>'
  buffer += data.name
  buffer += '</th>'

  for (var headersIndex = 0; headersIndex < data.headers.length; headersIndex++) {
    if (data.headers[headersIndex]) {
      buffer += '<th>'
      buffer += data.headers[headersIndex]
      buffer += '</th>'
    }
  }
  buffer += '</tr>'

  for (var optionsIndex = 0; optionsIndex < data.options.length; optionsIndex++) {
    buffer += '<tr>'

    buffer += '<td>'
    buffer += data.options[optionsIndex].name
    buffer += '</td>'

    for (var headersIndex = 0; headersIndex < data.headers.length; headersIndex++) {
      if (data.headers[headersIndex]) {
        buffer += '<td>'
        for (var optionValuesIndex = 0; optionValuesIndex < data.optionValues.length; optionValuesIndex++) {
          if (data.optionValues[optionValuesIndex].rows[optionsIndex] && data.optionValues[optionValuesIndex].rows[optionsIndex]['column_' + (headersIndex + 1) + '_value'] != null) {
            buffer += data.optionValues[optionValuesIndex].abbreviation + ': ' + data.optionValues[optionValuesIndex].rows[optionsIndex]['column_' + (headersIndex + 1) + '_value']
            buffer += '<br>'
          }
        }
        buffer += '</td>'
      }
    }

    buffer += '</tr>'
  }

  buffer += '</tbody>'
  buffer += '</table>'
  buffer += '<br>'

  return buffer
}

export default SizingChart
