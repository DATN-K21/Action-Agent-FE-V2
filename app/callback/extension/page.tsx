'use client';

export interface CallbackExtensionPageParams {
  searchParams?: { [key: string]: string | string[] | undefined };
}

function CallbackExtensionPage(props: CallbackExtensionPageParams) {
  const searchParams = props.searchParams;

  const success = searchParams?.success;
  if (success || success === 'true') {
    console.log('Successfully connected to extension');
  } else {
    console.log('Failed to connect to extension');
  }
  // Redirect to tools page after
  window.location.href = '/tools';

  return null;
}

export default CallbackExtensionPage;