import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.io.StringWriter;

import com.gargoylesoftware.htmlunit.BrowserVersion;
import com.gargoylesoftware.htmlunit.CollectingAlertHandler;
import com.gargoylesoftware.htmlunit.FailingHttpStatusCodeException;
import com.gargoylesoftware.htmlunit.NicelyResynchronizingAjaxController;
import com.gargoylesoftware.htmlunit.UnexpectedPage;
import com.gargoylesoftware.htmlunit.WebClient;
import org.apache.commons.io.IOUtils;
import com.gargoylesoftware.htmlunit.FailingHttpStatusCodeException;
import com.gargoylesoftware.htmlunit.WebClient;
import com.gargoylesoftware.htmlunit.html.HtmlButton;
import com.gargoylesoftware.htmlunit.html.HtmlPage;
import com.gargoylesoftware.htmlunit.html.HtmlTextInput;
import com.gargoylesoftware.htmlunit.html.HtmlTable;
import org.junit.After;
import org.junit.Before;
import org.junit.Test;

public class htmlUnitTest {
    private WebClient webClient;
    @Before
    public void init() throws Exception{
        webClient= new WebClient(BrowserVersion.CHROME);
        webClient.getOptions().setThrowExceptionOnFailingStatusCode(false);
        //webClient.getOptions().setThrowExceptionOnScriptError(false);
        //webClient.getOptions().setJavaScriptEnabled(false);
    }
    @After
    public void close() throws Exception{
        webClient.close();
    }
    @Test
    public void unitTest6AMZN() throws FailingHttpStatusCodeException, MalformedURLException, IOException {
        CollectingAlertHandler alertHandler = new CollectingAlertHandler();
        webClient.setAlertHandler(alertHandler);
        webClient.setAjaxController(new NicelyResynchronizingAjaxController());
        HtmlPage currentPage = webClient.getPage("http://www.thestackbrokers.com/");
        //HtmlPage currentPage = webClient.getPage("http://localhost:3000/");
        webClient.waitForBackgroundJavaScript(30000);
        // Get form where submit button is located
        HtmlTextInput searchInput = (HtmlTextInput) currentPage.getElementById("searchBar");
        HtmlButton button = currentPage.getHtmlElementById("submit");
        HtmlTable outputTable = currentPage.getHtmlElementById("table");
        //^capturing what we'll use to test search I/O

        //first input
        searchInput.setText("AMZN");
        button.click();

        webClient.waitForBackgroundJavaScript(30000);
        /*//outputTable = currentPage.getHtmlElementById("outputRow");
        System.out.println(outputTable.getRowCount());
        System.out.println(alertHandler.getCollectedAlerts());*/
        //System.out.println(button.getNameAttribute());
        if(outputTable.getCellAt(1,0).asText()=="AMZN"){
            System.out.println("Success on Test 1-1");
        }else{
            System.out.println("Failure on Test 1-1");
            System.out.println(outputTable.getCellAt(1,0).asText());
        }
    }
    @Test
    public void unitTest6Null() throws FailingHttpStatusCodeException, MalformedURLException, IOException {
        CollectingAlertHandler alertHandler = new CollectingAlertHandler();
        webClient.setAlertHandler(alertHandler);
        webClient.setAjaxController(new NicelyResynchronizingAjaxController());
        HtmlPage currentPage = webClient.getPage("http://www.thestackbrokers.com/");
        //HtmlPage currentPage = webClient.getPage("http://localhost:3000/");
        webClient.waitForBackgroundJavaScript(30000);
        // Get form where submit button is located
        //HtmlForm searchForm = (HtmlForm) currentPage.getElementById("searchBar");
        HtmlTextInput searchInput = (HtmlTextInput) currentPage.getElementById("searchBar");
        HtmlButton button = currentPage.getHtmlElementById("submit");

        HtmlTable outputTable = currentPage.getHtmlElementById("table");

        //^capturing what we'll use to test search I/O
        //second input
        searchInput.setText("");

        button.click();
        if (String.valueOf(alertHandler.getCollectedAlerts()).equals("[Please Enter A Valid Ticker]")) {
            System.out.println("Success on Test 1-2");
        } else {
            System.out.println("Failure on Test 1-2");
            System.out.println(String.valueOf(alertHandler.getCollectedAlerts()));
        }
        alertHandler.handleAlert(currentPage, String.valueOf(alertHandler.getCollectedAlerts()));
    }
    @Test
    public void unitTest6CHUNGUS() throws FailingHttpStatusCodeException, MalformedURLException, IOException {
        CollectingAlertHandler alertHandler = new CollectingAlertHandler();
        webClient.setAlertHandler(alertHandler);
        webClient.setAjaxController(new NicelyResynchronizingAjaxController());
        HtmlPage currentPage = webClient.getPage("http://www.thestackbrokers.com/");
        //HtmlPage currentPage = webClient.getPage("http://localhost:3000/");
        webClient.waitForBackgroundJavaScript(30000);
        // Get form where submit button is located
        //HtmlForm searchForm = (HtmlForm) currentPage.getElementById("searchBar");
        HtmlTextInput searchInput = (HtmlTextInput) currentPage.getElementById("searchBar");
        HtmlButton button = currentPage.getHtmlElementById("submit");

        HtmlTable outputTable = currentPage.getHtmlElementById("table");

        //^capturing what we'll use to test search I/O
        //third input
        searchInput.setText("CHUNGUS");
        button.click();

        if (String.valueOf(alertHandler.getCollectedAlerts()).equals("[Please Enter A Valid Ticker]")) {
            System.out.println("Success on Test 1-3");
        } else {
            System.out.println("Failure on Test 1-3");
            System.out.println(String.valueOf(alertHandler.getCollectedAlerts()));
        }
        alertHandler.handleAlert(currentPage, String.valueOf(alertHandler.getCollectedAlerts()));
    }
    @Test
    public void unitTest6CRICK() throws FailingHttpStatusCodeException, MalformedURLException, IOException {
        CollectingAlertHandler alertHandler = new CollectingAlertHandler();
        webClient.setAlertHandler(alertHandler);
        webClient.setAjaxController(new NicelyResynchronizingAjaxController());
        HtmlPage currentPage = webClient.getPage("http://www.thestackbrokers.com/");
        //HtmlPage currentPage = webClient.getPage("http://localhost:3000/");
        webClient.waitForBackgroundJavaScript(30000);
        // Get form where submit button is located
        //HtmlForm searchForm = (HtmlForm) currentPage.getElementById("searchBar");
        HtmlTextInput searchInput = (HtmlTextInput) currentPage.getElementById("searchBar");
        HtmlButton button = currentPage.getHtmlElementById("submit");

        HtmlTable outputTable = currentPage.getHtmlElementById("table");

        //^capturing what we'll use to test search I/O
        //fourth input
        searchInput.setText("CRICK");
        button.click();

        if (String.valueOf(alertHandler.getCollectedAlerts()).equals("[You Entered A Ticker That Does Not Exist]")) {
            System.out.println("Success on Test 1-4");
        } else {
            System.out.println("Failure on Test 1-4");
            System.out.println(String.valueOf(alertHandler.getCollectedAlerts()));
        }
        alertHandler.handleAlert(currentPage, String.valueOf(alertHandler.getCollectedAlerts()));
    }
    @Test
    public void unitTest6aMzN() throws FailingHttpStatusCodeException, MalformedURLException, IOException {
        CollectingAlertHandler alertHandler = new CollectingAlertHandler();
        webClient.setAlertHandler(alertHandler);
        webClient.setAjaxController(new NicelyResynchronizingAjaxController());
        HtmlPage currentPage = webClient.getPage("http://www.thestackbrokers.com/");
        //HtmlPage currentPage = webClient.getPage("http://localhost:3000/");
        webClient.waitForBackgroundJavaScript(30000);
        // Get form where submit button is located
        //HtmlForm searchForm = (HtmlForm) currentPage.getElementById("searchBar");
        HtmlTextInput searchInput = (HtmlTextInput) currentPage.getElementById("searchBar");
        HtmlButton button = currentPage.getHtmlElementById("submit");

        HtmlTable outputTable = currentPage.getHtmlElementById("table");

        //^capturing what we'll use to test search I/O
        //fifth input
        searchInput.setText("aMzN");
        button.click();

        if (outputTable.getCellAt(1, 0).asText() == "AMZN") {
            System.out.println("Success on Test 1-5");
        } else {
            System.out.println("Failure on Test 1-5");
            System.out.println(outputTable.getCellAt(1, 0));
        }
    }
    @Test
    public void unitTest6645G() throws FailingHttpStatusCodeException, MalformedURLException, IOException {
        CollectingAlertHandler alertHandler = new CollectingAlertHandler();
        webClient.setAlertHandler(alertHandler);
        webClient.setAjaxController(new NicelyResynchronizingAjaxController());
        HtmlPage currentPage = webClient.getPage("http://www.thestackbrokers.com/");
        //HtmlPage currentPage = webClient.getPage("http://localhost:3000/");
        webClient.waitForBackgroundJavaScript(30000);
        // Get form where submit button is located
        //HtmlForm searchForm = (HtmlForm) currentPage.getElementById("searchBar");
        HtmlTextInput searchInput = (HtmlTextInput) currentPage.getElementById("searchBar");
        HtmlButton button = currentPage.getHtmlElementById("submit");

        HtmlTable outputTable = currentPage.getHtmlElementById("table");

        //^capturing what we'll use to test search I/O
        //sixth input
        searchInput.setText("345G!");
        button.click();

        if(String.valueOf(alertHandler.getCollectedAlerts()).equals("[Please Enter A Valid Ticker]")){
            System.out.println("Success on Test 1-6");
        }else{
            System.out.println("Failure on Test 1-6");
            System.out.println(String.valueOf(alertHandler.getCollectedAlerts()));
        }

    }
    @Test
    public void unitTest5AMZN() throws FailingHttpStatusCodeException, MalformedURLException, IOException {
    //We'll start by reading that the server has thingies
        UnexpectedPage serverSidePage = webClient.getPage("http://www.thestackbrokers.com/api/stocks/AMZN");
        InputStream serverSideStream = serverSidePage.getInputStream();
        StringWriter writer = new StringWriter();
        IOUtils.copy(serverSideStream, writer, "UTF-8");
        if(writer.toString().contains("AMZN")){
            System.out.println("Success on Test 2-1");
        }else{
            System.out.println("Failure on Test 2-1");
            System.out.println(writer.toString());
            System.out.println(writer.toString().substring(12,16));
        }
        }
        //System.out.println(serverSidePage.toString());
    @Test
    public void unitTest5goog() throws FailingHttpStatusCodeException, MalformedURLException, IOException {
        //We'll start by reading that the server has thingies
        UnexpectedPage serverSidePage = webClient.getPage("http://www.thestackbrokers.com/api/stocks/goog");
        InputStream serverSideStream = serverSidePage.getInputStream();
        StringWriter writer = new StringWriter();
        IOUtils.copy(serverSideStream, writer, "UTF-8");
        if(writer.toString().length()>17) {
            if (writer.toString().contains("[]")) {
                System.out.println("Success on Test 2-2");
            } else {
                System.out.println("Failure on Test 2-2");
                System.out.println(writer.toString());
                System.out.println(writer.toString().substring(12, 16));
            }
        }else{
            System.out.println("Failure on Test 2-2");
        }
    }
    @Test
    public void unitTest5GORGONTHEFIFTH() throws FailingHttpStatusCodeException, MalformedURLException, IOException {
        //We'll start by reading that the server has thingies
        UnexpectedPage serverSidePage = webClient.getPage("http://www.thestackbrokers.com/api/stocks/GORGONTHEFIFTHHASNASTYTOES");
        InputStream serverSideStream = serverSidePage.getInputStream();
        StringWriter writer = new StringWriter();
        IOUtils.copy(serverSideStream, writer, "UTF-8");
        if(writer.toString().length()>17) {
            if (writer.toString().contains("[]")) {
                System.out.println("Success on Test 2-3");
            } else {
                System.out.println("Failure on Test 2-3");
                System.out.println(writer.toString());
                System.out.println(writer.toString().substring(12, 16));
            }
        }else{
            System.out.println("Failure on Test 2-3");
        }
    }
    @Test
    public void unitTest5MSFT() throws FailingHttpStatusCodeException, MalformedURLException, IOException {
        //We'll start by reading that the server has thingies
        UnexpectedPage serverSidePage = webClient.getPage("http://www.thestackbrokers.com/api/stocks/MSFT");
        InputStream serverSideStream = serverSidePage.getInputStream();
        StringWriter writer = new StringWriter();
        IOUtils.copy(serverSideStream, writer, "UTF-8");
        if(writer.toString().length()>17) {
            if (writer.toString().contains("MSFT")) {
                System.out.println("Success on Test 5-4");
            } else {
                System.out.println("Failure on Test 5-4");
                System.out.println(writer.toString());
                System.out.println(writer.toString().substring(12, 16));
            }
        }else{
            System.out.println("Failure on Test 5-4");
        }
    }
    @Test
    public void unitTest1AMZN() throws FailingHttpStatusCodeException, MalformedURLException, IOException {
        //We'll start by reading that the server has thingies
        UnexpectedPage serverSidePage = webClient.getPage("http://www.thestackbrokers.com/api/stocks/AMZN/history");
        InputStream serverSideStream = serverSidePage.getInputStream();
        StringWriter writer = new StringWriter();
        IOUtils.copy(serverSideStream, writer, "UTF-8");
        if(writer.toString().contains("AMZN")){
            System.out.println("Success on Test 1-1");
        }else{
            System.out.println("Failure on Test 1-1");
            System.out.println(writer.toString());
            System.out.println(writer.toString().substring(12,16));
        }
    }
    @Test
    public void unitTest1goog() throws FailingHttpStatusCodeException, MalformedURLException, IOException {
        //We'll start by reading that the server has thingies
        UnexpectedPage serverSidePage = webClient.getPage("http://www.thestackbrokers.com/api/stocks/goog/history");
        InputStream serverSideStream = serverSidePage.getInputStream();
        StringWriter writer = new StringWriter();
        IOUtils.copy(serverSideStream, writer, "UTF-8");
        if(writer.toString().length()>17) {
            if (writer.toString().contains("[]")) {
                System.out.println("Success on Test 1-2");
            } else {
                System.out.println("Failure on Test 1-2");
                System.out.println(writer.toString());
                System.out.println(writer.toString().substring(12, 16));
            }
        }else{
            System.out.println("Failure on Test 1-2");
        }
    }
    @Test
    public void unitTest1GORGONTHEFIFTH() throws FailingHttpStatusCodeException, MalformedURLException, IOException {
        //We'll start by reading that the server has thingies
        UnexpectedPage serverSidePage = webClient.getPage("http://www.thestackbrokers.com/api/stocks/GORGONTHEFIFTHHASNASTYTOES/history");
        InputStream serverSideStream = serverSidePage.getInputStream();
        StringWriter writer = new StringWriter();
        IOUtils.copy(serverSideStream, writer, "UTF-8");
        if(writer.toString().length()>17) {
            if (writer.toString().contains("[]")) {
                System.out.println("Success on Test 1-3");
            } else {
                System.out.println("Failure on Test 1-3");
                System.out.println(writer.toString());
                System.out.println(writer.toString().substring(12, 16));
            }
        }else{
            System.out.println("Failure on Test 1-3");
        }
    }
    @Test
    public void unitTest1MSFT() throws FailingHttpStatusCodeException, MalformedURLException, IOException {
        //We'll start by reading that the server has thingies
        UnexpectedPage serverSidePage = webClient.getPage("http://www.thestackbrokers.com/api/stocks/MSFT/history");
        InputStream serverSideStream = serverSidePage.getInputStream();
        StringWriter writer = new StringWriter();
        IOUtils.copy(serverSideStream, writer, "UTF-8");
        if(writer.toString().length()>17) {
            if (writer.toString().contains("MSFT")) {
                System.out.println("Success on Test 1-4");
            } else {
                System.out.println("Failure on Test 1-4");
                System.out.println(writer.toString());
                System.out.println(writer.toString().substring(12, 16));
            }
        }else{
            System.out.println("Failure on Test 1-4");
        }
    }
    }

