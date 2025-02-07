<script>
  import { getPingData } from "../state/api";
  import { pageState, pageTitle } from "../state/stores";
  import { getBigQueryURL } from "../state/urls";

  import AppAlert from "../components/AppAlert.svelte";
  import VariantSelector from "../components/VariantSelector.svelte";
  import AuthenticatedLink from "../components/AuthenticatedLink.svelte";
  import Commentary from "../components/Commentary.svelte";
  import HelpHoverable from "../components/HelpHoverable.svelte";
  import ItemList from "../components/ItemList.svelte";
  import MetadataTable from "../components/MetadataTable.svelte";
  import NotFound from "../components/NotFound.svelte";
  import Markdown from "../components/Markdown.svelte";
  import PageTitle from "../components/PageTitle.svelte";
  import { PING_SCHEMA } from "../data/schemas";

  export let params;

  let selectedAppVariant;
  const pingDataPromise = getPingData(params.app, params.ping).then(
    (pingData) => {
      [selectedAppVariant] = pingData.variants;
      return pingData;
    }
  );

  $pageState = {
    search: "",
    showExpired: true,
    ...$pageState,
  };
  pageTitle.set(`${params.ping} | ${params.app}`);
</script>

{#await pingDataPromise then ping}
  {#if ping.origin && ping.origin !== params.app}
    <AppAlert
      status="warning"
      message={`This ping is defined by a library used by the application (__${ping.origin}__), rather than the application itself. For more details, see the definition.`}
    />
  {/if}

  <PageTitle text={ping.name} />
  <p>
    <Markdown text={ping.description} />
  </p>

  <h2>Metadata</h2>
  <MetadataTable appName={params.app} item={ping} schema={PING_SCHEMA} />

  <h2>Commentary</h2>
  <Commentary item={ping} itemType={"ping"} />

  <h2>Access</h2>

  {#if ping.variants.length > 1}
    <VariantSelector
      name={"app_id"}
      label={"Application Variant"}
      bind:selectedVariant={selectedAppVariant}
      variants={ping.variants}
    />
  {/if}

  {#if selectedAppVariant}
    <table>
      <col />
      <col />
      <tr>
        <td>
          BigQuery
          <HelpHoverable
            content={"The BigQuery representation of this ping."}
          />
        </td>
        <td>
          <a
            href={getBigQueryURL(
              params.app,
              selectedAppVariant.id,
              params.ping
            )}
          >
            {selectedAppVariant.table}
          </a>
        </td>
      </tr>
      {#if selectedAppVariant.looker_url}
        <tr>
          <td>
            Looker
            <HelpHoverable
              content={"Explore this ping in Mozilla's instance of Looker."}
            />
          </td>
          <td>
            <AuthenticatedLink href={selectedAppVariant.looker_url}>
              {params.ping}
            </AuthenticatedLink>
          </td>
        </tr>
      {/if}
    </table>
  {/if}

  <h2>Metrics</h2>
  <ItemList itemType="metrics" items={ping.metrics} appName={params.app} />
{:catch}
  <NotFound pageName={params.ping} itemType="ping" />
{/await}

<style>
  @import "../main.scss";

  @include metadata-table;
  h2 {
    @include text-title-xs;
  }
</style>
