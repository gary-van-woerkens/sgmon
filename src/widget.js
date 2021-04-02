"use strict"

// -----------------------------------------------------------------------------
// Data
// -----------------------------------------------------------------------------

const sites = [
  { name: "www", url: "https://www.fabrique.social.gouv.fr/healthz" },
  { name: "emjpm", url: "https://emjpm.fabrique.social.gouv.fr" },
  { name: "cdtn", url: "https://code.travail.gouv.fr/health" },
  { name: "cdtn-api", url: "https://cdtn-api.fabrique.social.gouv.fr/healthz" },
  { name: "standup", url: "https://standup.fabrique.social.gouv.fr/healthz" },
  {
    name: "carnets",
    url: "https://carnets.fabrique.social.gouv.fr/api/healthz",
  },
  { name: "egapro", url: "https://index-egapro.travail.gouv.fr/" },
  { name: "medle", url: "https://medle.fabrique.social.gouv.fr/api/healthz" },
  { name: "onvs", url: "https://onvs.fabrique.social.gouv.fr/api/healthz" },
  {
    name: "archifilre",
    url: "https://archifiltre.fabrique.social.gouv.fr/healthz",
  },
  {
    name: "oz ensemble",
    url: "https://ozensemble.fabrique.social.gouv.fr/healthz",
  },
  {
    name: "mon suivi psy",
    url: "https://monsuivipsy.fabrique.social.gouv.fr/healthz",
  },
  {
    name: "1000 jours",
    url: "https://1000jours.fabrique.social.gouv.fr/healthz",
  },
  {
    name: "fce",
    url: "https://fce.fabrique.social.gouv.fr/healthz",
  },
  {
    name: "domifa",
    url: "https://domifa.fabrique.social.gouv.fr/healthz",
  },
  {
    name: "mano",
    url: "https://mano.fabrique.social.gouv.fr/healthz",
  },
  {
    name: "tumeplay",
    url: "https://tumeplay.fabrique.social.gouv.fr/healthz",
  },
  {
    name: "covid",
    url: "https://covid.fabrique.social.gouv.fr/healthz",
  },
]

// -----------------------------------------------------------------------------
// Styles
// -----------------------------------------------------------------------------

const theme = {
  status: {
    success: {
      text: Color.dynamic(new Color("#018786"), new Color("#1F414F")),
      icon: Color.dynamic(new Color("#018786"), new Color("#1F414F")),
      border: Color.dynamic(new Color("#018786"), new Color("#51AACF")),
      background: Color.dynamic(new Color("#03DAC6"), new Color("#51AACF")),
    },
    failure: {
      text: new Color("#121212"),
      icon: Color.dynamic(new Color("#018786"), new Color("#121212")),
      border: Color.dynamic(new Color("#018786"), new Color("#CF6679")),
      background: new Color("#CF6679"),
    },
  },
  background: Color.dynamic(new Color("#FFFFFF"), new Color("#121212")),
}

// -----------------------------------------------------------------------------
// Widget
// -----------------------------------------------------------------------------

const checkUrl = async (url) => {
  const req = new Request(url)
  try {
    await req.load()
    return true
  } catch (error) {
    return false
  }
}

const addName = async (item, name, isResponsive, statusColors) => {
  const container = item.addStack()
  const text = container.addText(name)

  text.font = isResponsive
    ? Font.mediumSystemFont(16)
    : Font.semiboldSystemFont(16)

  text.textColor = statusColors.text
}

const addStatus = (item, isResponsive, statusColors) => {
  const container = item.addStack()
  const symbol = SFSymbol.named(
    isResponsive ? "checkmark" : "exclamationmark.triangle"
  )
  const image = container.addImage(symbol.image)

  image.tintColor = statusColors.icon
  image.imageSize = isResponsive ? new Size(14, 14) : new Size(18, 18)
}

const addItem = async (widget, { name, url }) => {
  const item = widget.addStack()
  const isResponsive = await checkUrl(url)
  const statusColors = theme.status[isResponsive ? "success" : "failure"]

  item.borderWidth = 2
  item.cornerRadius = 4
  item.centerAlignContent()
  item.setPadding(4, 6, 4, 6)
  item.borderColor = statusColors.border
  item.backgroundColor = statusColors.background

  addName(item, name, isResponsive, statusColors)
  item.addSpacer()
  addStatus(item, isResponsive, statusColors)
}

const addRow = async (widget, max, index) => {
  const row = widget.addStack()
  const items = sites.slice(index * max, index * max + max)

  for (let i = 0; i < items.length; i++) {
    await addItem(row, items[i])
    if (i < items.length - 1) row.addSpacer()
  }
}

const createWidget = async () => {
  const widget = new ListWidget()

  const [rowsCount, colsCount] =
    config.widgetFamily === "large"
      ? [18, 2]
      : config.widgetFamily === "medium"
      ? [4, 2]
      : [4, 1]

  widget.setPadding(20, 16, 20, 16)
  widget.backgroundColor = theme.background

  for (let i = 0; i < rowsCount; i++) {
    await addRow(widget, colsCount, i)
    if (i < rowsCount - 1 && sites.length > (i + 1) * colsCount) {
      widget.addSpacer(null)
    }
  }

  return widget
}

// -----------------------------------------------------------------------------
// Rendering
// -----------------------------------------------------------------------------

const main = async () => {
  const widget = await createWidget()
  widget.presentSmall()
  Script.setWidget(widget)
  Script.complete()
}

main().catch((error) => {
  console.log(error)
})
