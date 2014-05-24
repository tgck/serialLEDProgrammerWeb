/*
  WS2812 LED Control Script v1.00  2014/04/12
 */

#include <SoftwareSerial.h>

#define DEF_CMD_LENGTH       (8)            /* Fixed length */
#define ACK                  (0x06)         /* Return value of success. */

#define PIN_UART_RX          (2)            /* LED Control Software Serial Rx Port */
#define PIN_UART_TX          (3)            /* LED Control Software Serial Tx Port */
#define PIN_RESET            (4)            /* LED Control Reset Port */
#define PIN_BAUDRATE         (5)            /* LED Control Baudrate Select Port */
#define PIN_TRIGGER          (PIN_BAUDRATE) /* LED Control Trigger Port (Same Baudrate) */

#define RESET_PIN_CONNECT    (1)            /* 1:Reset Port Connected. 0:Not Connected. */
#define BAUDRATE_PIN_CONNECT (1)            /* 1:Baudrate Select Port Connected. 0:Not Connected. */
#define IS_HI_SPEED_UART     (1)            /* 1:Hi speed. 0:Low speed */

#if IS_HI_SPEED_UART
  #define UART_SPEED         (57600)        /* 57600bps */
#else
  #define UART_SPEED         (19200)        /* 19200bps */
#endif /* HI_SPEED_UART_EN */

#define UART_RES_TOUT        (1000)         /* 1000ms time out */

/* Commands Table. Run sequentially. */
const uint8_t led_play_list[][DEF_CMD_LENGTH] =
{
[key_cmd_list]};


/* Number of lines of command. */
#define DEF_CMD_LINES        (sizeof(led_play_list)/DEF_CMD_LENGTH)

/* Run. ACK command, returned to play after completion. */
const uint8_t play_cmd[DEF_CMD_LENGTH] = 
{
    0x94, 0x03, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};

/* Stop. */
const uint8_t stop_cmd[DEF_CMD_LENGTH] = 
{
    0x94, 0x02, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00
};

static void shield_init(void);
static void shield_reset(void);
static void shield_play_tbl(const uint8_t tbl[][DEF_CMD_LENGTH], int lines);

static SoftwareSerial mySerial(PIN_UART_RX, PIN_UART_TX);

void setup()
{
  /* initialize shield. */
  shield_init();

  /* start */
  shield_play_tbl(led_play_list, DEF_CMD_LINES);
} 

void loop()
{
}

static void init_baudrate(void)
{
#if BAUDRATE_PIN_CONNECT
 /* Set Output Baudrate Select Port */
  pinMode(PIN_BAUDRATE, OUTPUT);
#if IS_HI_SPEED_UART
  digitalWrite(PIN_BAUDRATE, LOW);
#else
  digitalWrite(PIN_BAUDRATE, HIGH);
#endif /* IS_HI_SPEED_UART */
#endif /* BAUDRATE_PIN_CONNECT */

  /* Initialization process of software serial */
  mySerial.begin(UART_SPEED);
  mySerial.setTimeout(UART_RES_TOUT);
}

static void init_trigger(void)
{
#if BAUDRATE_PIN_CONNECT
  /* It operates as a trigger pin for active low. */
  digitalWrite(PIN_BAUDRATE, HIGH);
#endif /* BAUDRATE_PIN_CONNECT */
}

static void shield_reset(void)
{
#if RESET_PIN_CONNECT
  pinMode(PIN_RESET, OUTPUT);    /* Set Output Reset Port */

  /* LED Contorl Reset. 50ms Low */
  digitalWrite(PIN_RESET, LOW);
  delay(50);
  digitalWrite(PIN_RESET, HIGH);

  /* It is necessary to wait for 200ms or more. */
  /* waits for the completion of the initialization process. */
  delay(200);
#endif /* RESET_EN */
}

static void shield_init(void)
{
  /* select the communication speed. */
  init_baudrate();

  /* reset the controller. */
  shield_reset();

  /* enable the trigger port. */
  init_trigger();
}

static char write_and_rsp(const uint8_t* pcmd)
{
  char rsp;

  /* send 8byte command. */
  mySerial.write(pcmd, DEF_CMD_LENGTH);
  
  /* wait return command. */
  if(1 != mySerial.readBytes( &rsp, 1))
  {
    rsp = NULL;
  }

  return rsp;  
}

static void shield_play_tbl(const uint8_t tbl[][DEF_CMD_LENGTH], int lines)
{
  int i;
  char rsp;
  
  /* Batch Transfer the data */
  for(i = 0 ; i < lines ; i++)
  {
    /* Send 8byte command and wait response. */
    rsp = write_and_rsp(&tbl[i][0]);
    
    /* check ack command. */
    if(rsp != ACK)
    {
      break;
    }
  }
  
  /* start trigger.*/
  if(rsp == ACK)
  {
    mySerial.write(play_cmd, DEF_CMD_LENGTH);
  }
}
